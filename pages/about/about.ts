import { html, HTMLStream } from "../../lib/html.ts";
import { AssemblyLine, AssemblyStages } from "../../lib/responses.ts";
import { neiredevPage } from "../main.ts";

export default [
  {
    header: AssemblyStages.OBJECT,
    processor: (): Promise<[string, string]> => {
      const content: [string, string] = [
        `Hello, I am the first person. Today, I have come to talk to you about
        a bearded man with a squared face and an amorphous mind who spends
        his days sitting in front of a clock, watching life go by. He is
        waiting for the exact moment, though he’s not entirely sure for which;
        what he is sure of is that he doesn’t want to miss it, and for that
        reason, he prefers to trade hours of sleep for a few more hours in
        front of the clock. This habit reflects on his face in the form of
        dark bags under his eyes, too dark to blend in with skin toasted by
        his burnout syndrome. The alternative, sleeping, would be worse: he
        knows the clock keeps ticking even when he’s not looking. So he can
        only rest a bit better when he's not sleeping. He doesn’t mind
        dragging himself in the mornings: he’ll drink coffee, sure, that's
        what it's for! And if anxiety consumes him after the third cup, he’ll
        take the fourth one with some benzos, and if that's not enough, he’ll
        have the fifth with one or two glasses of alcohol.`,

        `He stays in front of the clock, as if he were allergic to doing
        anything more productive. Maybe he studies the clock to learn from it.
        Yes, deep down, he would like to be more like a clock, where after one
        comes two, and after two comes three. Perhaps that’s the same reason
        he became a programmer, where everything is algorithms and surprises
        are scarce. Maybe it’s for the same reason that he dresses in gray,
        with plaid shirts, just in case one day the order surrounding him
        manages to seep into his mind. For him, thinking like a robot seems
        like an attractive idea: at least robots are programmed to fulfill a
        purpose. If asked, he would probably answer that, given
        the choice, he would prefer to be a man with an amorphous face and a
        squared mind.`,
      ];
      return new Promise((resolve) => resolve(content));
    },
  },
  {
    header: AssemblyStages.FRAGMENT,
    processor: async (content: [string, string]): Promise<HTMLStream> => {
      return html`
        <style>
          ${(await Deno.open(import.meta.dirname + "/about.css")).readable}
        </style>

        <!-- hidden forbidden holy tab buttons -->
        <input
          type="radio" name="pagination" id="about-page1"
          role="tab"
          checked hidden
        >
        <input
          type="radio" name="pagination" id="about-page2"
          role="tab"
          hidden
        >

        <h1>About Me</h1>
        <p class="page-content-about" id="about-page1-content" role="tabpanel">
          ${content[0]}
        </p>
        <p class="page-content-about" id="about-page2-content" role="tabpanel">
          ${content[1]}
        </p>

        <nav class="pagination-labels" role="tablist">
          <label for="about-page1" role="tab"></label>
          <label for="about-page2" role="tab"></label>
        </nav>
      `;
    },
  },
  {
    header: AssemblyStages.FULL,
    processor: (input: HTMLStream): Promise<HTMLStream> => {
      return new Promise((resolve) => resolve(neiredevPage([input])));
    },
  },
] as AssemblyLine;
