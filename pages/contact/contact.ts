import { html, HTMLStream } from "../../lib/html.ts";
import { AssemblyLine, AssemblyStages } from "../../lib/responses.ts";
import { neiredevPage } from "../main.ts";
import contactEntries from "./entries.ts";

export interface ContactEntry {
  icon: string | (() => HTMLStream);
  alt: string;
  link: URL;
}

export default [
  {
    header: AssemblyStages.OBJECT,
    processor: (): Promise<object> => {
      return new Promise((resolve) => resolve(contactEntries));
    },
  },
  {
    header: AssemblyStages.FRAGMENT,
    processor: async (entries: ContactEntry[]): Promise<HTMLStream> => {
      const style = html`
        <style>
          ${(await Deno.open(import.meta.dirname + "/contact.css")).readable}
        </style>
      `;

      const contacts = entries.map((entry) => {
        return html`
            <a
                href="${entry.link.href}"
                title="${entry.alt}"
                target="_blank"
                class="contact"
            >
              ${(typeof entry.icon == "string") ? entry.icon : entry.icon()}
            </a>
        `;
      });

      return new Promise(
        (resolve) =>
          resolve(
            html`
              ${style}
              <div class="contacts">
                  ${contacts}
              </div>
              <a class="mail" href="mailto:contact@neire.dev">
                  contact@neire.dev
              </a>
            `,
          ),
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
