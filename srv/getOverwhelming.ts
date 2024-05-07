const games = await Bun.file("srv/data/gamescores.json").json();
import { csvFormat } from "d3-dsv";

const result = games.reduce(
  (
    acc: { season: any; team: any; games: number; overwhelming: number }[],
    game: {
      homeScore: any;
      awayScore: any;
      homeTeam: any;
      season: any;
      awayTeam: any;
    },
  ) => {
    const exists1 = acc.find((record: { team: any; season: any }) =>
      record.team === game.homeTeam && record.season === game.season
    );
    const exists2 = acc.find((record: { team: any; season: any }) =>
      record.team === game.awayTeam && record.season === game.season
    );
    if (!exists1) {
      acc.push({
        season: game.season,
        team: game.homeTeam,
        games: 1,
        overwhelming: game.homeScore - game.awayScore > 2 ? 1 : 0,
      });
    }
    if (exists1) {
      exists1.games += 1;
      game.homeScore - game.awayScore > 2 ? exists1.overwhelming += 1 : null;
    }
    if (!exists2) {
      acc.push({
        season: game.season,
        team: game.awayTeam,
        games: 1,
        overwhelming: game.awayScore - game.homeScore > 2 ? 1 : 0,
      });
    }
    if (exists2) {
      exists2.games += 1;
      game.awayScore - game.homeScore > 2 ? exists2.overwhelming += 1 : null;
    }
    return acc;
  },
  [],
);

console.log(result);

const CSV = csvFormat(result);

Bun.write("srv/data/overwhelming.json", JSON.stringify(result));
Bun.write("srv/data/overwhelming.csv", CSV);
