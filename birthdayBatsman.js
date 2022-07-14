import request from "request";
import cheerio from "cheerio";
import chalk from "chalk";

const url =
  "https://www.espncricinfo.com/series/ipl-2020-21-1210595/chennai-super-kings-vs-kings-xi-punjab-53rd-match-1216506/full-scorecard";

console.log("Scrapping started");

request(url, (error, response, html) => {
  if (error) {
    console.error("Error : ", error);
  } else {
    console.log(chalk.yellow("Status Code : "), response.statusCode);

    handleHTML(html);
  }
});

console.log("Scrapping Ended");

async function handleHTML(html) {
  let $ = cheerio.load(html);

  let inningArr = $(".ds-bg-fill-content-prime.ds-rounded-lg");

  for (let i = 0; i < inningArr.length; i++) {
    let TeamElement = $(inningArr[i]).find(
      ".ds-text-tight-s.ds-font-bold.ds-uppercase"
    );
    let Team = TeamElement.text();

    Team = Team.split("INNINGS")[0];
    Team = Team.trim();

    console.log(chalk.bgBlueBright(Team));

    let tableElement = $(inningArr[i]).find(
      ".ds-w-full.ds-table.ds-table-xs.ds-table-fixed.ci-scorecard-table"
    );
    let batsman = $(tableElement).find(
      ".ds-border-b.ds-border-line.ds-text-tight-s"
    );

    for (let j = 1; j < batsman.length; j++) {
      let allCols = $(batsman[j]).find("td");
      let batsmanName = $(allCols[0]).text();
      let runs = $(allCols[2]).text();

      if (batsmanName === "Extras") {
        continue;
      }

      let birth_href =
        "https://www.espncricinfo.com" + $(allCols[0]).find("a").attr("href");

      console.log(
        chalk.bgRedBright("Batsman : " + batsmanName + " - Runs : " + runs)
      );
    //   console.log(chalk.bgBlackBright(birth_href));

      await getPlayerProfile(birth_href , batsmanName);
    }
  }
}

function getPlayerProfile(birth_href , batsmanName) {

  request(birth_href, (error, response, html) => {
    if (error) {
      console.error("Error : ", error);
    } else {
     getBorn(html , batsmanName);
    }
  });
  
}

function getBorn(html , batsmanName)
{
      let $ = cheerio.load(html);

      let detailArr = $(".ds-grid-cols-2.ds-gap-4.ds-mb-8 > div > span");
    //   console.log(detailArr.length);

      let born = $(detailArr[1]).text();
      console.log(chalk.bgBlackBright("Name : "+batsmanName+" - Born : "+born));
}
