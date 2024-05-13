const goals = await Bun.file("srv/data/goals.json").json();
import { csvFormat } from "d3-dsv";

type GameRecord = {
  season: any;
  team: any;
  playoff: boolean;
  goals: number;
  pp1: number;
  pp2: number;
  sh1: number;
  sh2: number;
  eng: number;
  ea: number;
  gws: number;
  eq: number;
  ps: number;
  [key: string]: any;
};

const result = goals.reduce(
  (
    acc: GameRecord[],
    goal: {
      executedBy: string;
      season: any;
      athletePosition: string;
      situationType: string;
      playoff: boolean;
    },
  ) => {
    const exists = acc.find((
      record: GameRecord,
    ) =>
      record.team === goal.executedBy && record.season === goal.season &&
      record.playoff === goal.playoff
    );
    const codes = goal.situationType;
    const codesArray = codes.split(",");

    if (!exists) {
      acc.push({
        season: goal.season,
        team: goal.executedBy,
        playoff: goal.playoff,
        goals: 1,
        pp1: codesArray.includes("PP1") ? 1 : 0,
        pp2: codesArray.includes("PP2") ? 1 : 0,
        sh1: codesArray.includes("SH1") ? 1 : 0,
        sh2: codesArray.includes("SH2") ? 1 : 0,
        eng: codesArray.includes("ENG") ? 1 : 0,
        ea: codesArray.includes("EA") ? 1 : 0,
        gws: codesArray.includes("GWS") ? 1 : 0,
        eq: codesArray.includes("EQ") ? 1 : 0,
        ps: codesArray.includes("PS") ? 1 : 0,
      });
    }
    if (exists) {
      exists.goals += 1;
      codesArray.forEach((code) => {
        const key = code.toLowerCase();
        exists[key] += 1;
      });
    }
    return acc;
  },
  [],
);

console.log(result);

const CSV = csvFormat(result);

Bun.write("srv/data/goalsbypowerplay.json", JSON.stringify(result));
Bun.write("srv/data/goalsbypowerplay.csv", CSV);
