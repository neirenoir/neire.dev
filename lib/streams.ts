const encoder = new TextEncoder();

export type TemplateValues =
  | ReadableStream
  | string
  | number
  | TemplateValues[];

// Template literal processing function
export function stream(
  strings: TemplateStringsArray,
  ...values: TemplateValues[]
): ReadableStream {
  let reader: ReadableStreamDefaultReader | undefined = undefined;
  let currentPair = 0;
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(strings[currentPair]));
      if (currentPair >= values.length) {
        controller.close();
      }
    },
    async pull(controller) {
      {
        const curr = values[currentPair];
        if (curr instanceof Array) {
          values[currentPair] = concat(...curr);
        }
      }
      const value = values[currentPair] as ReadableStream | string;
      if (value instanceof ReadableStream) {
        reader = reader ? reader : value.getReader();
        const result = await reader.read();
        if (result.done) {
          // Done with this stream. Onto the next one
          reader.releaseLock();
          reader = undefined;
          currentPair++;
        } else {
          controller.enqueue(result.value);
          return;
        }
      } else {
        controller.enqueue(encoder.encode(value));
        currentPair++;
      }

      if (currentPair < strings.length) {
        controller.enqueue(encoder.encode(strings[currentPair]));
      } else {
        controller.close();
      }
    },
  });

  return stream;
}

export function concat(
  ...streams: TemplateValues[]
): ReadableStream {
  let reader: ReadableStreamDefaultReader | undefined = undefined;
  const stack: { array: TemplateValues[]; index: number }[] = [
    {
      array: streams,
      index: 0,
    },
  ];

  async function next(controller: ReadableStreamDefaultController) {
    const activeStack = stack.at(-1);
    if (activeStack == null || activeStack.index >= activeStack.array.length) {
      controller.close();
      return;
    }

    const currentStream = activeStack.array[activeStack.index];
    if (currentStream instanceof ReadableStream) {
      reader = reader ? reader : currentStream.getReader();
      const result = await reader.read();
      if (result.done) {
        reader.releaseLock();
        reader = undefined;
        activeStack.index++;
        next(controller);
      } else {
        controller.enqueue(
          result.value instanceof Uint8Array
            ? result.value
            : encoder.encode(result.value),
        );
      }
    } else if (currentStream instanceof Array) {
      activeStack.index++;
      stack.push({
        array: currentStream,
        index: 0,
      });
      next(controller);
    } else {
      controller.enqueue(encoder.encode(currentStream.toString()));
      activeStack.index++;
    }

    if (activeStack.index >= activeStack.array.length) {
      stack.pop();
    }
  }
  const joint = new ReadableStream({
    start(controller) {
      if (streams.length == 0) {
        controller.close();
      }
    },
    async pull(controller) {
      await next(controller);
    },
  });

  return joint;
}
