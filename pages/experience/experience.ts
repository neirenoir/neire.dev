import { html, HTMLStream } from "../../lib/html.ts";
import { AssemblyLine, AssemblyStages } from "../../lib/responses.ts";
import { neiredevPage } from "../main.ts";
import { default as entries } from "./entries.ts";

export type DatePair = {
  start: Date;
  end: Date | string;
};

export interface ExperienceEntry {
  name: string;
  description: string;
  role: string;
  dates: DatePair;
  icon: string | (() => HTMLStream);
}

export default [
  {
    header: AssemblyStages.OBJECT,
    processor: (): Promise<ExperienceEntry[]> => {
      return new Promise((resolve) => resolve(entries));
    },
  },
  {
    header: AssemblyStages.FRAGMENT,
    processor: async (entries: ExperienceEntry[]): Promise<HTMLStream> => {
      const style = html`
        <style>
          ${(await Deno.open(import.meta.dirname + "/experience.css")).readable}
        </style>
      `;
      const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
      });
      const htmlEntries = entries.map(
        (entry): HTMLStream => {
          const icon = (typeof entry.icon == "string")
            ? entry.icon
            : entry.icon();
          const dateStart = dateTimeFormat.format(entry.dates.start);
          const dateEnd = (entry.dates.end instanceof Date)
            ? dateTimeFormat.format(entry.dates.end)
            : entry.dates.end;
          return html`
            <li class="experience-entry">
              <div class="experience-logo">
                <span class="experience-icon" role="img">
                    ${icon}
                </span>
              </div>
              <div class="experience-info">
                  <h2>${entry.name}</h2>
                  <h3>${entry.description}</h3>
                  <p class="experience-role">${entry.role}</p>
                  <p class="experience-date">
                      <span>${dateStart}</span>
                      →
                      <span>${dateEnd}</span>
                  </p>
              </div>
            </li>
          `;
        },
      );

      return new Promise(
        (resolve) =>
          resolve(
            html`
              ${style}
              <h1>Experience</h1>
              <ul class="experience-entries">${htmlEntries}</ul>
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
