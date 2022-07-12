import request from "request";
import cheerio from "cheerio";
import chalk from "chalk";

const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/chennai-super-kings-vs-kings-xi-punjab-53rd-match-1216506/full-scorecard";

console.log("Scrapping started");

request(url, (error, response, html)=>{
    if(error)
    {
        console.error("Error : ",error);
    }
    else
    {
        console.log(chalk.yellow("Status Code : "),response.statusCode);

        handleHTML(html);
    }
})

console.log("Scrapping Ended");

function handleHTML(html){

    let $ = cheerio.load(html);
    let dataArr = $(".ci-team-score.ds-flex.ds-justify-between.ds-items-center.ds-text-typo-title.ds-mb-2");

    let winTeam = "";

    for(let i=0 ; i<dataArr.length ; i++)
    {
        let hasclass = $(dataArr[i]).hasClass("ds-opacity-50");
        // console.log(hasclass);
        if(hasclass === false)
        {
            winTeam = $(dataArr[i]).find(".ds-flex.ds-items-center").text().trim();
            let htmlData = $(dataArr[i]).html();

            console.log(chalk.bgBlackBright("Winning Team : "+winTeam));
            console.log(chalk.bgWhite("HTML Data : "+htmlData));

            break;
        }
    }

    console.log(chalk.bgBlueBright("Scrapping Winning Team : "+winTeam+" - Score Table"));

    let inningArr = $(".ds-bg-fill-content-prime.ds-rounded-lg");

    // let htmlstr = "";

    for(let i=0 ; i<inningArr.length ; i++)
    {
        // let gethtml = $(inningArr[i]).html();
        // htmlstr += gethtml;

        let TeamElement = $(inningArr[i]).find(".ds-text-tight-s.ds-font-bold.ds-uppercase");
        let Team = TeamElement.text();

        Team = Team.split("INNINGS")[0];
        Team = Team.trim();

        // console.log(chalk.bgBlueBright(Team));

        if(Team===winTeam)
        {
            let tableElement = $(inningArr[i]).find(".ds-w-full.ds-table.ds-table-xs.ds-table-fixed.ci-scorecard-table");
            let batsman = $(tableElement).find(".ds-border-b.ds-border-line.ds-text-tight-s"); 

            for(let j=1 ; j<batsman.length ; j++)
            {
                let allCols = $(batsman[j]).find("td");
                let batsmanName = $(allCols[0]).text();
                let runs = $(allCols[2]).text();

                if(batsmanName === "Extras")
                {
                    continue;
                }

                console.log(chalk.bgRedBright("Batsman : "+batsmanName+" - Runs : "+runs));
            }

        }
        else
        {
            let tableElement = $(inningArr[i]).find(".ds-w-full.ds-table.ds-table-xs.ds-table-fixed");

            let ballers = $(tableElement[1]).find(".ds-border-b.ds-border-line.ds-text-tight-s"); 

            for(let j=1 ; j<ballers.length ; j++)
            {
                let allCols = $(ballers[j]).find("td");
                let ballersName = $(allCols[0]).text();
                let wickets = $(allCols[4]).text();

                console.log(chalk.bgGreenBright("Baller : "+ballersName+" - Wickets : "+wickets));
            }

        }

    }
    
}