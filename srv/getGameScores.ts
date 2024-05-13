import { readdir } from "node:fs/promises";
import { csvFormat } from "d3-dsv";

const seasons = [
  "2023",
  "2022",
  "2021",
  "2019",
  "2018",
  "2017",
  "2016",
];

const result = [];

for (let i = 0; i < seasons.length; i++) {
  const files = await readdir(`srv/data/json/${seasons[i]}`).then((data) =>
    data.filter((name: string) => name !== ".DS_Store").sort()
  );

  for (let j = 0; j < files.length; j++) {
    const json = await Bun.file(
      `srv/data/json/${seasons[i]}/${files[j]}`,
    ).text();
    const data = JSON.parse(json);
    const gameRank = parseInt(files[j].split("-")[0]);
    const playoff = gameRank > 56;

    result.push({
      season: seasons[i],
      homeTeam: data.HomeTeam.ShortTeamName,
      awayTeam: data.AwayTeam.ShortTeamName,
      homeScore: parseInt(data.CurrentScore.Home),
      awayScore: parseInt(data.CurrentScore.Away),
      gameRank,
      playoff,
    });
  }
}

const CSV = csvFormat(result);

Bun.write("srv/data/gamescores.json", JSON.stringify(result));
Bun.write("srv/data/gamescores.csv", CSV);
