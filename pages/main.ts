import { cssLink, html, htmlPage, HTMLStream } from "../lib/html.ts";
import { concat } from "../lib/streams.ts";

export function neiredevPage(main: HTMLStream[]) {
  return htmlPage({
    title: "neire.dev",
    head: [
      cssLink("static/css/reset.css"),
      cssLink("static/css/main.css"),
    ],
    body: [
      html`
        <nav>
          <span class="logo"><a href="/">neire.dev</a></span>
          <ul>
            <li><a href="/about">About Me</a></li>
            <li><a href="/experience">Experience</a></li>
            <li><a href="/portfolio">Portfolio</a></li>
            <!--<li><a href="/demos">Demos</a></li>-->
          </ul>
          <a href="mailto:contact@neire.dev">Contact</a>
        </nav>
      `,
      html`
        <main>
          ${concat(...main)}
        </main>
      `,
      html`
        <footer>
          <span>©</span>
          <small>
            ${`neire.dev 2024-${new Date().getFullYear()}`}
          </small>
        </footer>
      `,
    ],
  });
}
