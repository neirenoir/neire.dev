import { ExperienceEntry } from "./experience.ts";
import { html } from "../../lib/html.ts";

export default [
  {
    name: "Institut Escola del Treball",
    description: "Web Application Development",
    role: "Student",
    icon: () => html`<img src="../static/images/escoladeltreball.svg" />`,
    dates: {
      start: new Date("2016-09-01"),
      end: new Date("2019-06-01"),
    },
  },
  {
    name: "Nereid",
    description: "Logistics Software Development",
    role: "Developer",
    icon: () => html`<img src="../static/images/mermaid.svg" />`,
    dates: {
      start: new Date("2016-12-01"),
      end: new Date("2019-08-01"),
    },
  },
  {
    name: "Laboratori de Lletres",
    description: "Novel Writing Classes",
    role: "Student",
    icon: () =>
      html`
        <style>
            .logo-ll {
                font-size: 0.7em;
                letter-spacing: 0;
                margin-top: -0.5em;
                transform: scale(1, 1.2);
            }

            .logo-ll * {
                display: inline-block;
            }

            .logo-ll-ll {
                transform: scale(0.5, 1.25);
                letter-spacing: 0;
                margin: 0 -0.25em;
                font-weight: bold;
                margin-bottom: -1em;
                position: relative;
                bottom: -3px;
            }
        </style>
        <table class="logo-ll">
            <tr>
                <td>]</td><td><span class="logo-ll-ll">LL</span></td><td>{</td>
            </tr>
        </table>
      `,
    dates: {
      start: new Date("2019-03-01"),
      end: new Date("2020-11-01"),
    },
  },
  {
    name: "Kanaloa Network AG",
    description: "Blockchain Solutions Engineering",
    role: "Co-founder, CTO",
    icon: () => html`<span style="margin-top: -0.2em;"></span>`,
    dates: {
      start: new Date("2021-04-01"),
      end: new Date("2024-11-01"),
    },
  },
  {
    name: "Freelancer",
    description: "Smart Contract Developer",
    role: "Jack of All Trades",
    icon: () => html`<span style="margin-top: -0.2em;">⌂</span>`,
    dates: {
      start: new Date("2024-11-01"),
      end: "Now",
    },
  },
] as ExperienceEntry[];
