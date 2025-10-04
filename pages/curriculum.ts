import { cssLink, html, htmlPage, HTMLStream } from "../lib/html.ts";
import { AssemblyLine, AssemblyStages } from "../lib/responses.ts";
import ContactPipeline, { ContactEntry } from "./contact/contact.ts";
import ExperiencePipeline, {
  ExperienceEntry,
} from "./experience/experience.ts";
import PortfolioPipeline, { PortfolioEntry } from "./portfolio/portfolio.ts";
import { concat } from "../lib/streams.ts";

const OBJECT_STAGE = 0;

export interface CurriculumBody {
  contact: ContactEntry[];
  experience: ExperienceEntry[];
  portfolio: PortfolioEntry[];
}

function asPage(cssClass: string, contents: HTMLStream) {
  return html`
      <div class="page ${cssClass}" data-size="A4">
          ${contents}
          <footer class="logo">
              <a href="https://neire.dev">neire.dev</a>
          </footer>
      </div>
  `;
}

export default [
  {
    header: AssemblyStages.OBJECT,
    processor: async (): Promise<CurriculumBody> => {
      const contact = await ContactPipeline[OBJECT_STAGE].processor(
        {},
      ) as ContactEntry[];
      const experience = await ExperiencePipeline[OBJECT_STAGE].processor(
        {},
      ) as ExperienceEntry[];
      const portfolio = await PortfolioPipeline[OBJECT_STAGE].processor(
        {},
      ) as PortfolioEntry[];

      const curriculumBody: CurriculumBody = {
        contact: contact,
        experience: experience,
        portfolio: portfolio,
      };

      return new Promise((resolve) => resolve(curriculumBody));
    },
  },
  {
    header: AssemblyStages.FRAGMENT,
    processor: (curriculumBody: CurriculumBody): Promise<HTMLStream> => {
      const htmlExperience = curriculumBody.experience.toReversed().map(
        (entry): HTMLStream => {
          const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
            month: "long",
            year: "numeric",
          });
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

      const htmlPortfolio = curriculumBody.portfolio.map(
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
                <ul>
                  ${technologies}
                </ul>
              </div>
              ${link}
            </li>
          `;
        },
      );
      const contacts = curriculumBody.contact.map((entry) => {
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

      const allPages = concat(
        asPage(
          "experience-page",
          html`
              <h1>Experience</h1>
              <ul>
                  ${htmlExperience}
              </ul>
          `,
        ),
        asPage(
          "portfolio-page",
          html`
              <h1>Portfolio</h1>
              <ul>
                  ${htmlPortfolio.slice(0, 4)}
              </ul>
          `,
        ),
        asPage(
          "portfolio-page",
          html`
              <ul>
                  ${htmlPortfolio.slice(4, -1)}
              </ul>
          `,
        ),
        asPage(
          "contact-page",
          html`
              <div class="contacts">
                  ${contacts}
              </div>
              <a class="mail" href="mailto:contact@neire.dev">
                  contact@neire.dev
              </a>
          `,
        ),
      );

      return new Promise((resolve) => resolve(allPages));
    },
  },
  {
    header: AssemblyStages.FULL,
    processor: (input: HTMLStream): Promise<HTMLStream> => {
      return new Promise((resolve) =>
        resolve(htmlPage({
          title: "neire.dev",
          head: [
            cssLink("/static/css/reset.css"),
            cssLink("/static/css/curriculum.css"),
            html`
              <meta name="description" content="Paint it black.">
              <meta name="author" content="neirenoir">
              <meta name="theme-color" content="#000000">
          `,
          ],
          body: [
            asPage(
              "main-page",
              html`
                  <h1>Paint it black.</h1>
                  <h2>Blockchain, web development, writing, consulting.</h2>
              `,
            ),
            input,
          ],
        }))
      );
    },
  },
] as AssemblyLine;
