export type AcceptableResponseBodies =
  | BodyInit
  | Record<string | number | symbol, unknown>;

export enum AssemblyStages {
  RAW = "raw",
  OBJECT = "object",
  FRAGMENT = "fragment",
  FULL = "full",
}

export interface AssemblyStage<I, O> {
  header: string;
  processor: <I, O>(input: I) => Promise<O>;
}

export type AssemblyLine = [
  AssemblyStage<unknown, unknown>,
  ...AssemblyStage<unknown, unknown>[],
];

export const AssemblyStageHeader = "X-Assembly-Stage";

export function isBodyInit(obj: unknown): obj is BodyInit {
  return obj instanceof String ||
    obj instanceof ReadableStream ||
    obj instanceof Blob ||
    obj instanceof ArrayBuffer ||
    ArrayBuffer.isView(obj) ||
    obj instanceof FormData ||
    obj instanceof URLSearchParams;
}

export async function assemble(
  req: Request,
  chain: AssemblyLine,
): Promise<AcceptableResponseBodies | Response> {
  const json = req.headers.get("Accept") == "application/json"
    ? AssemblyStages.OBJECT
    : undefined;
  const header = json || req.headers.get(AssemblyStageHeader);

  let input: unknown = req;
  let output = await chain[0].processor(input);

  if (!(output instanceof Response)) {
    for (let i = 1; i < chain.length; i++) {
      // Process the assembly pipeline from the second stage
      const stage = chain[i];
      input = output;
      output = await stage.processor(input);
      if (stage.header == header || output instanceof Response) {
        break;
      }
    }
  }
  return new Promise((resolve) =>
    resolve(
      output instanceof Response || isBodyInit(output)
        ? output
        : JSON.stringify(output),
    )
  );
}
