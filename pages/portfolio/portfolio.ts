import { html, HTMLStream } from "../../lib/html.ts";
import { AssemblyLine, AssemblyStages } from "../../lib/responses.ts";
import { neiredevPage } from "../main.ts";
import { default as entries } from "./entries.ts";

export interface PortfolioEntry {
  name: string;
  description: string;
  role: string;
  icon: string;
  technologies: string[];
  link: URL | (() => HTMLStream);
}

export default [
  {
    header: AssemblyStages.OBJECT,
    processor: (): Promise<PortfolioEntry[]> => {
      return new Promise((resolve) => resolve(entries));
    },
  },
  {
    header: AssemblyStages.FRAGMENT,
    processor: async (entries: PortfolioEntry[]): Promise<HTMLStream> => {
      const style = html`
        <style>
          ${(await Deno.open(import.meta.dirname + "/portfolio.css")).readable}
        </style>
      `;
      const htmlEntries = entries.map(
        (entry): HTMLStream => {
          const tech = entry.technologies;
          const technologies = tech.map(
            (technology) => {
              return html`<li>${technology}</li>`;
            },
          );
          const link = (entry.link instanceof URL)
            ? `<a href="${entry.link.href}">${entry.link.href}</a>`
            : entry.link();

          return html`
            <li class="portfolio-entry">
              <h2>${entry.name}</h2>
              <p class="portfolio-role">${entry.role}</p>
              <div class="portfolio-description">
                <span class="portfolio-icon" role="img">
                  ${entry.icon}
                </span>
                <span>${entry.description}</span>
              </div>
              <div class="marquee">
                <ul style="
                    animation-duration: ${technologies.length * 2}s;
                ">
                  ${technologies}
                </ul>
              </div>
              ${link}
            </li>
          `;
        },
      );

      return new Promise((resolve) =>
        resolve(html`
          ${style}
          <h1>Portfolio</h1>
          <ul class="portfolio-entries">${htmlEntries}</ul>
        `)
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
