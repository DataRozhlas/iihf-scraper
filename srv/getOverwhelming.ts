const games = await Bun.file("srv/data/gamescores.json").json();
import { csvFormat } from "d3-dsv";

const result = games.reduce(
  (
    acc: {
      season: any;
      team: any;
      playoff: boolean;
      games: number;
      victories: number;
      overwhelming: number;
    }[],
    game: {
      season: any;
      homeScore: any;
      awayScore: any;
      homeTeam: any;
      awayTeam: any;
      playoff: boolean;
    },
  ) => {
    const exists1 = acc.find((
      record: { team: any; season: any; playoff: boolean },
    ) =>
      record.team === game.homeTeam && record.season === game.season &&
      record.playoff === game.playoff
    );
    const exists2 = acc.find((
      record: { team: any; season: any; playoff: boolean },
    ) =>
      record.team === game.awayTeam && record.season === game.season &&
      record.playoff === game.playoff
    );
    if (!exists1) {
      acc.push({
        season: game.season,
        team: game.homeTeam,
        playoff: game.playoff,
        games: 1,
        victories: game.homeScore > game.awayScore ? 1 : 0,
        overwhelming: game.homeScore - game.awayScore > 2 ? 1 : 0,
      });
    }
    if (exists1) {
      exists1.games += 1;
      game.homeScore > game.awayScore ? exists1.victories += 1 : null;
      game.homeScore - game.awayScore > 2 ? exists1.overwhelming += 1 : null;
    }
    if (!exists2) {
      acc.push({
        season: game.season,
        team: game.awayTeam,
        playoff: game.playoff,
        games: 1,
        victories: game.awayScore > game.homeScore ? 1 : 0,
        overwhelming: game.awayScore - game.homeScore > 2 ? 1 : 0,
      });
    }
    if (exists2) {
      exists2.games += 1;
      game.awayScore > game.homeScore ? exists2.victories += 1 : null;
      game.awayScore - game.homeScore > 2 ? exists2.overwhelming += 1 : null;
    }
    return acc;
  },
  [],
);

console.log(result);

const CSV = csvFormat(result);

Bun.write("srv/data/overwhelmingVictories.json", JSON.stringify(result));
Bun.write("srv/data/overwhelmingVictories.csv", CSV);
