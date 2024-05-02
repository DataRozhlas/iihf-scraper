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
    const attendance = parseInt(data.Spectators);
    const gameId = data.GameId;
    const homeTeam = data.HomeTeam.ShortTeamName;
    const awayTeam = data.AwayTeam.ShortTeamName;
    const homeTeamScore = parseInt(data.CurrentScore.Home);
    const awayTeamScore = parseInt(data.CurrentScore.Away);
    const date = data.EventDateTime.Value;
    const venue = data.Venue.Name;

    result.push({
      attendance,
      gameId,
      homeTeam,
      homeTeamScore,
      awayTeam,
      awayTeamScore,
      season: seasons[i],
      date,
      venue,
    });
  }
}

const CSV = csvFormat(result);

Bun.write("srv/data/attendanceStats.json", JSON.stringify(result));
Bun.write("srv/data/attendanceStats.csv", CSV);
