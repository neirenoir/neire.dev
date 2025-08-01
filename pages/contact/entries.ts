import { ContactEntry } from "./contact.ts";
import { html } from "../../lib/html.ts";

export default [
  {
    icon: "",
    alt: "GitHub",
    link: new URL("https://github.com/neirenoir/"),
  },
  {
    icon: "𝕏",
    alt: "Twitter",
    link: new URL("https://x.com/neirenoir/"),
  },
  {
    icon: () => html`<span style="font-size: 0.9em;"></span>`,
    alt: "Discord",
    link: new URL("https://discordapp.com/users/neirenoir/"),
  },
] as ContactEntry[];
