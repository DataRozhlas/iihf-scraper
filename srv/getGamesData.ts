import { readdir } from "node:fs/promises";
import { parse } from "node-html-parser";

const getRawData = async (url: string) => {
  const raw = await fetch(url);
  const html = await raw.text();
  return html;
};

const seasonsFiles = await readdir("srv/data/seasons").then((data) =>
  data.filter((name: string) => name !== ".DS_Store").sort()
);

seasonsFiles.forEach(async (seasonfile) => {
  const file = await Bun.file(
    `srv/data/seasons/${seasonfile}`,
  )
    .text();
  const root = parse(file);
  const games = root.querySelectorAll(
    "a.s-hover__link",
  ).filter((game) => game.innerText.includes("Game Centre"));

  const gameLinks = games.map((game) => game.getAttribute("href"));

  const year = seasonfile.split(".")[0];

  for (let i = 0; i < gameLinks.length; i++) {
    const url = `https://www.iihf.com${gameLinks[i]}`;
    const html = await getRawData(url);
    if (gameLinks[i]) {
      Bun.write(
        `srv/data/games/${year}/${gameLinks[i]?.split("/").pop()}.html`,
        html,
      );
      console.log(year, gameLinks[i]?.split("/").pop(), "done");
    }
    setTimeout(() => {}, 1000);
  }
});
