const goals = await Bun.file("srv/data/goals.json").json();
import { csvFormat } from "d3-dsv";

const result = goals.reduce(
  (
    acc: {
      season: any;
      team: any;
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
    }[],
    goal: {
      homeTeam: any;
      season: any;
      athletePosition: string;
      situationType: string;
    },
  ) => {
    const exists = acc.find((
      record: {
        team: any;
        season: any;
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
      },
    ) => record.team === goal.homeTeam && record.season === goal.season);
    const codes = goal.situationType;
    const codesArray = codes.split(",");

    if (!exists) {
      acc.push({
        season: goal.season,
        team: goal.homeTeam,
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
        exists[code.toLowerCase() as keyof typeof exists] += 1;
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
