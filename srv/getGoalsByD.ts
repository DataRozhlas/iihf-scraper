const goals = await Bun.file("srv/data/goals.json").json();
import { csvFormat } from "d3-dsv";

const result = goals.reduce(
  (
    acc: { season: any; team: any; goals: number; goalsByDefence: number }[],
    goal: { homeTeam: any; season: any; athletePosition: string },
  ) => {
    const exists = acc.find((record: { team: any; season: any }) =>
      record.team === goal.homeTeam && record.season === goal.season
    );
    if (!exists) {
      acc.push({
        season: goal.season,
        team: goal.homeTeam,
        goals: 1,
        goalsByDefence: goal.athletePosition === "D" ? 1 : 0,
      });
    }
    if (exists) {
      exists.goals += 1;
      goal.athletePosition === "D" ? exists.goalsByDefence += 1 : null;
    }
    return acc;
  },
  [],
);

console.log(result);

const CSV = csvFormat(result);

Bun.write("srv/data/goalsbydefence.json", JSON.stringify(result));
Bun.write("srv/data/goalsbydefence.csv", CSV);
