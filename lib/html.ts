import { concat, stream, TemplateValues } from "./streams.ts";

// Behold the illusion of type safety
export type HTMLStream = ReadableStream;
export type CSSStream = ReadableStream;
export type JSStream = ReadableStream;

export interface HTMLPageParams {
  title: string;
  head?: (ReadableStream | string)[];
  body: (ReadableStream | string)[];
}

// Template processing function
export function htmlPage(
  { title, head, body }: HTMLPageParams,
): HTMLStream {
  return html`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
        ${head ? concat(...head) : ""}
      </head>
      <body>
        ${concat(...body)}
      </body>
    </html>
  `;
}

export function cssNode(contents: CSSStream | string): CSSStream {
  return stream`<style>${contents}</style>`;
}

export function cssLink(path: string): HTMLStream {
  return stream`<link rel="stylesheet" href="${path}">`;
}

// Syntax highlighter trick template functions
export const html: (
  strings: TemplateStringsArray,
  ...values: TemplateValues[]
) => HTMLStream = stream;

export const css: (
  strings: TemplateStringsArray,
  ...values: TemplateValues[]
) => CSSStream = stream;
