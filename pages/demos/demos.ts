import { html, HTMLStream } from "../../lib/html.ts";
import { AssemblyLine, AssemblyStages } from "../../lib/responses.ts";
import { neiredevPage } from "../main.ts";

export default [
  {
    header: AssemblyStages.OBJECT,
    processor: (): Promise<string> => {
      return new Promise((resolve) => resolve("Under construction."));
    },
  },
  {
    header: AssemblyStages.FRAGMENT,
    processor: (content: string): Promise<HTMLStream> => {
      return new Promise((resolve) =>
        resolve(
          html`
            <h1>Demos</h1>
                ${content}
            </p>
          `,
        )
      );
    },
  },
  {
    header: AssemblyStages.FULL,
    processor: (input: HTMLStream): Promise<HTMLStream> => {
      return new Promise((resolve) => resolve(neiredevPage([input])));
    },
  },
] as AssemblyLine;
