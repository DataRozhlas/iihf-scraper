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

    for (let k = 0; k < data.Periods.length; k++) {
      const goals = data.Periods[k].ScoringActions;
      const gameId = data.GameId;
      const season = seasons[i];
      const homeTeam = data.HomeTeam.ShortTeamName;
      const awayTeam = data.AwayTeam.ShortTeamName;

      for (let l = 0; l < goals.length; l++) {
        const goal = goals[l];

        result.push({
          gameId,
          actionId: goal.Id,
          season,
          period: k + 1,
          situationType: goal.SituationType,
          code: goal.Code,
          scorerName: goal.Scorer !== null ? goal.Scorer.ReportingName : null,
          athletePosition: goal.Scorer !== null ? goal.Scorer.Position : null,
          time: goal.TimeOfPlay,
          executedBy: goal.ExecutedByShortTeamName,
          homeTeam,
          awayTeam,
        });
      }
    }
  }
}

const CSV = csvFormat(result);

Bun.write("srv/data/goals.json", JSON.stringify(result));
Bun.write("srv/data/goals.csv", CSV);
