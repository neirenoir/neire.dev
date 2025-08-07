import { cssLink, html, htmlPage, HTMLStream } from "../lib/html.ts";
import { concat } from "../lib/streams.ts";

export function neiredevPage(main: HTMLStream[]) {
  return htmlPage({
    title: "neire.dev",
    head: [
      cssLink("/static/css/reset.css"),
      cssLink("/static/css/main.css"),
      html`
          <meta name="description" content="Paint it black.">
          <meta name="robots" content="index, follow">

          <meta name="author" content="neirenoir">
          <html lang="en"> <!-- or "es", "fr", etc. -->
          <link rel="icon" href="/static/images/favicon.svg" type="image/svg+xml">
          <meta name="theme-color" content="#000000">

          <!-- Twitter Card -->
          <meta name="twitter:card" content="summary">
          <meta name="twitter:title" content="neire.dev">
          <meta name="twitter:description" content="Paint it black.">
          <meta name="twitter:image" content="https://neire.dev/pages/static/images/icon.png">
          <meta name="twitter:site" content="@neirenoir">
      `,
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
          <a href="/contact">Contact</a>
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
