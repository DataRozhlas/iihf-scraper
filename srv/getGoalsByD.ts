const goals = await Bun.file("srv/data/goals.json").json();
import { csvFormat } from "d3-dsv";

const result = goals.reduce(
  (
    acc: {
      season: any;
      playoff: boolean;
      team: any;
      goals: number;
      goalsByDefence: number;
    }[],
    goal: {
      executedBy: any;
      season: any;
      athletePosition: string;
      playoff: boolean;
    },
  ) => {
    const exists = acc.find((
      record: { team: any; season: any; playoff: boolean },
    ) =>
      record.team === goal.executedBy && record.season === goal.season &&
      record.playoff === goal.playoff
    );
    if (!exists) {
      acc.push({
        season: goal.season,
        team: goal.executedBy,
        playoff: goal.playoff,
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
