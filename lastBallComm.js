import request from "request";
import cheerio from "cheerio";
import chalk from "chalk";

const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/chennai-super-kings-vs-kings-xi-punjab-53rd-match-1216506/ball-by-ball-commentary";

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
    let dataArr = $(".ds-ml-4 > div > p");

    let text = $(dataArr[0]).text();
    let htmlData = $(dataArr[0]).html();

    console.log(chalk.bgBlackBright("Text Data : "+text));
    console.log(chalk.bgWhite("HTML Data : "+htmlData));
}