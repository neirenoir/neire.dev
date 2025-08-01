import { PortfolioEntry } from "./portfolio.ts";
import { html } from "../../lib/html.ts";

export default [
  {
    name: "Kanaloa Network",
    description: "Modular smart contracts factory with bespoke access control.",
    role: "CTO, Lead Developer",
    icon: "",
    technologies: [
      "Solidity",
      "Foundry",
      "Avalanche",
      "Lit",
      "ethers.js",
      "Lion",
      "Nix",
      "NixOS",
    ],
    link: new URL("https://app.kanaloa.network"),
  },
  {
    name: "neire.dev",
    description: "This website. All handcrafted.",
    icon: "<span style='font-size: 1.4em; margin-top: -0.4em;'>◎</span>",
    role: "Solo Developer",
    technologies: [
      "TypeScript",
      "Deno",
      "Nix",
    ],
    link: new URL("https://neire.dev"),
  },
  {
    name: "AEVEREST++",
    description:
      "2022 Avalanche Summit Hackathon winner. High throughput custom VM.",
    icon: "⛰",
    role: "Web Developer, Consultor",
    technologies: [
      "TypeScript",
      "Deno",
      "Nix",
    ],
    link: new URL(
      "https://www.blog.encode.club/avalanche-summit-hackathon-powered-by-encode-club-summary-and-prizewinners-52f4592ffc9d",
    ),
  },
  {
    name: "<span style='font-size: 0.85em;'>You Don't Have The Right</span>",
    description: "Minecraft mod. Enhances doLimitedCrafting gamerule.",
    role: "Solo Developer",
    icon: "",
    technologies: [
      "Kotlin",
      "Java",
      "Minecraft Forge",
      "Sponge Mixins",
      "Gradle",
    ],
    link: new URL("https://modrinth.com/mod/you-dont-have-the-right"),
  },
  {
    name: "Bulking",
    description: "Minecraft mod. Overhaul of hunger system.",
    role: "Solo Developer",
    icon: "<span style='font-size: 1.4em; margin-top: -0.4em;'>♞</span>",
    technologies: [
      "Kotlin",
      "Java",
      "Minecraft Forge",
      "Sponge Mixins",
      "Architectury",
      "Diet",
      "Gradle",
    ],
    link: new URL("https://modrinth.com/mod/bulking"),
  },
  {
    name: "Green Feathers",
    description: "Minecraft mod. Adds stamina system.",
    role: "Copilot",
    icon: "♣",
    technologies: [
      "Java",
      "Minecraft Forge",
      "Sponge Mixins",
      "Gradle",
    ],
    link: new URL("https://github.com/Darkona/Green-Feathers"),
  },
  {
    name: "WAIFU",
    description: "Token for the Scarlet Waifu Capital Management DAO.",
    icon: "<span style='font-family: Doto;'>:3</span>",
    role: "Smart Contract Developer",
    technologies: [
      "Solidity",
      "Foundry",
      "Avalanche",
      "Nix",
    ],
    link: new URL("https://weebsite.xyz"),
  },
  {
    name: "Luna Macabra",
    description: "Lletres Joves Horta-Guinardó 2016 Noir Stories 3rd prize.",
    icon: "☾",
    role: "Author",
    technologies: [
      "Cyberpunk",
      "Noir",
      "Spanish",
    ],
    link: () =>
      html`
        <span>
            <a href="/static/docs/luna_macabra.pdf">Spanish</a>
            |
            <a href="/static/docs/macabre_moon.pdf">English (MTL)</a>
        </span>
    `,
  },
  {
    name: "Hipotermia",
    description: "Lletres Joves Horta-Guinardó 2018 Noir Stories 1st prize.",
    icon: "<span style='font-size: 0.9em;'>🖌</span>",
    role: "Author",
    technologies: [
      "Artpunk",
      "Noir",
      "Spanish",
    ],
    link: () =>
      html`
        <span>
            <a href="/static/docs/morirte_de_frio.pdf">Spanish</a>
            |
            <a href="/static/docs/freezing_to_death.pdf">English (MTL)</a>
        </span>
    `,
  },
] as PortfolioEntry[];
