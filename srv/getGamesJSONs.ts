import { readdir } from "node:fs/promises";
import { parse } from "node-html-parser";

const seasons = [
  "2024",
  "2023",
  "2022",
  "2021",
  "2020",
  "2019",
  "2018",
  "2017",
  "2016",
  "2015",
  "2014",
];

const downloadJSON = async (url: string) => {
  const json = await fetch(url);
  return json;
};

for (let i = 0; i < seasons.length; i++) {
  const files = await readdir(`srv/data/games/${seasons[i]}`).then((data) =>
    data.filter((name: string) => name !== ".DS_Store").sort()
  );
  for (let j = 0; j < files.length; j++) {
    const game = await Bun.file(
      `srv/data/games/${seasons[i]}/${files[j]}`,
    ).text();

    const root = parse(game);
    const gameID = root.querySelector("div#hero-game-center")?.getAttribute(
      "data-game-id",
    );
    if (gameID) {
      const jsonUrl =
        `https://realtime.iihf.com/gamestate/GetLatestState/${gameID}`;
      const data = await downloadJSON(jsonUrl);
      Bun.write(
        `srv/data/json/${seasons[i]}/${files[j].split(".")[0]}.json`,
        data,
      );
      console.log(seasons[i], files[j], "done");
      setTimeout(() => {}, 1000);
    }
    if (!gameID) console.log(seasons[i], files[j], "no pdf");
  }
}
