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
      const penalties = data.Periods[k].TimeLineActions.filter((
        action: { Code: string },
      ) => action.Code === "PTY");
      const gameId = data.GameId;
      const season = seasons[i];
      const homeTeam = data.HomeTeam.ShortTeamName;
      const awayTeam = data.AwayTeam.ShortTeamName;

      for (let l = 0; l < penalties.length; l++) {
        const penalty = penalties[l];
        console.log(penalty.Athlete);
        result.push({
          gameId,
          actionId: penalty.Id,
          season,
          period: k + 1,
          team: penalty.ExecutedByShortTeamName,
          penaltyCode: penalty.PenaltyCode,
          penaltyLength: penalty.PenaltyTimeMinutes,
          time: penalty.TimeOfPlay,
          playerName: penalty.Athlete !== undefined
            ? penalty.Athlete.ReportingName
            : null,
          athletePosition: penalty.Athlete !== undefined
            ? penalty.Athlete.Position
            : null,
          homeTeam,
          awayTeam,
        });
      }
    }
  }
}

const CSV = csvFormat(result);

Bun.write("srv/data/penalties.json", JSON.stringify(result));
Bun.write("srv/data/penalties.csv", CSV);
