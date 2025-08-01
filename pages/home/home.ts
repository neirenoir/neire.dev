import { html, HTMLStream } from "../../lib/html.ts";
import { AssemblyLine, AssemblyStages } from "../../lib/responses.ts";
import { neiredevPage } from "../main.ts";

export default [
  {
    header: AssemblyStages.OBJECT,
    processor: (): Promise<object> => {
      return new Promise((resolve) => resolve({}));
    },
  },
  {
    header: AssemblyStages.FRAGMENT,
    processor: (): Promise<HTMLStream> => {
      const fragment = html`
        <h1>Paint it black.</h1>
        <h2>Blockchain, web development, writing, consulting.</h2>
      `;
      return new Promise((resolve) => resolve(fragment));
    },
  },
  {
    header: AssemblyStages.FULL,
    processor: (input: HTMLStream): Promise<HTMLStream> => {
      return new Promise((resolve) => resolve(neiredevPage([input])));
    },
  },
] as AssemblyLine;
