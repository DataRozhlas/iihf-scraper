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

    for (let k = 0; k < data.Periods.length; k++) {
      const shots = data.Periods[k].IceRingActions;
      const gameId = data.GameId;
      const season = seasons[i];

      for (let l = 0; l < shots.length; l++) {
        const shot = shots[l];

        result.push({
          gameId,
          actionId: shot.Id,
          season,
          period: k + 1,
          shotType: shot.ShotType,
          code: shot.Code,
          x: shot.Coordinates.X,
          y: shot.Coordinates.Y,
          athleteName: shot.Athlete !== null
            ? shot.Athlete.ReportingName
            : null,
          athletePosition: shot.Athlete !== null ? shot.Athlete.Position : null,
          time: shot.TimeOfPlay,
          executedBy: shot.ExecutedByShortTeamName,
          executedAgainst: shot.IsExecutedByHomeTeam
            ? data.AwayTeam.ShortTeamName
            : data.HomeTeam.ShortTeamName,
          gameRank,
          playoff,
        });
      }
    }
  }
}

const CSV = csvFormat(result);

Bun.write("srv/data/shots.json", JSON.stringify(result));
Bun.write("srv/data/shots.csv", CSV);
