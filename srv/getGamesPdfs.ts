import { readdir } from "node:fs/promises";
import { parse } from "node-html-parser";

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

const downloadPDF = async (url: string) => {
  const pdf = await fetch(url);
  return pdf;
};

for (let i = 0; i < seasons.length; i++) {
  const files = await readdir(`srv/data/games/${seasons[i]}`).then((data) =>
    data.filter((name: string) => name !== ".DS_Store").sort()
  );
  for (let j = 0; j < files.length; j++) {
    const game = await Bun.file(
      `srv/data/games/${seasons[i]}/${files[j]}`,
    ).text();

    const root = parse(game);
    const links = root.querySelectorAll("a");
    const pdf = links.find((link) => link.innerText.includes("Shot Chart"))
      ?.getAttribute("href");
    if (pdf) {
      const pdfUrl = `https://www.iihf.com${pdf}`;
      const pdfData = await downloadPDF(pdfUrl);
      const pdfBlob = await pdfData.blob();
      Bun.write(
        `srv/data/pdf/${seasons[i]}/${files[j].split(".")[0]}.pdf`,
        pdfBlob,
      );
      console.log(seasons[i], files[j], "done");
      setTimeout(() => {}, 1000);
    }
    if (!pdf) console.log(seasons[i], files[j], "no pdf");
  }
}
