const seasons = [
  "2024",
  "2023",
  "2022",
  "2021",
  "2020",
  "2019",
  "2018",
  "2017",
  "2016",
  "2015",
  "2014",
];

const getRawData = async (url: string) => {
  const raw = await fetch(url);
  const html = await raw.text();
  return html;
};

seasons.forEach(async (season) => {
  const url = `https://www.iihf.com/en/events/${season}/wm/schedule`;
  const html = await getRawData(url);
  Bun.write(
    `.srv/data/seasons/${season}.html`,
    html,
  );
  console.log(season, "done");
});
