const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/royal-challengers-bangalore-vs-sunrisers-hyderabad-eliminator-1237178/full-scorecard";

const request = require("request");
const cheerio = require("cheerio");
const fs=require("fs");
const path=require("path");
const xlsx = require("xlsx");
function processScoreCard(url){
    request(url,cb);
}

function cb(err,request,html){
    if(err){
        console.log(err);
    }else{
        extractMatchDetail(html);
    }

}

function extractMatchDetail(html){
    // venue date opponent result sixes strikeRate
    // ipl-folder -> teamFile ->playerFile -> details(venue date opponent result sixes strikeRate)

    // dono teams ke liye venue date result common hoga

    // venue date -> ds-text-tight-m ds-font-regular ds-text-typo-mid3

    // result ->ds-text-tight-m ds-font-regular ds-truncate ds-text-typo

    let $ = cheerio.load(html);
    let descElem = $(".ds-text-tight-m.ds-font-regular.ds-text-typo-mid3");
    let result = $(".ds-text-tight-m.ds-font-regular.ds-truncate.ds-text-typo");
    // console.log(descElem.text()+" "+result.text()); 
    let stringArr = descElem.text().split(",");
    let venue = stringArr[1].trim();
    let date = stringArr[1].trim();
    result = result.text();
    let innings = $(".ds-w-full.ds-bg-fill-content-prime.ds-overflow-hidden.ds-rounded-xl.ds-border.ds-border-line.ds-mb-4");
    // let htmlString = "";
    // for(let i=0;i<2;i++){
    //     htmlString+=$(innings).html();
    // }
    // console.log(htmlString);

    // ipl-folder -> teamFile ->playerFile -> details(opponent fours sixes strikeRate)


    for(let i=0;i<2;i++){
        
        let teamName  = $(innings[i]).find(".ds-text-title-xs.ds-font-bold.ds-capitalize").text();
        let opponentIndex = i==0 ?1 :0;
        let opponentName = $(innings[opponentIndex]).find(".ds-text-title-xs.ds-font-bold.ds-capitalize").text();
        let cInning = $(innings[i]);
        let allRows = cInning.find(".ds-w-full.ds-table.ds-table-md.ds-table-auto.ci-scorecard-table tr");
        for(let j=0;j<allRows.length;j++){
            let allCols = $(allRows[j]).find("td");
            let isWorthy = $(allCols[0]).hasClass("ds-whitespace-nowrap ds-min-w-max ds-flex ds-items-center");
            if(isWorthy){
                // console.log(allCols.text());
                let playerName = $(allCols[0]).text().trim();
                let runs = $(allCols[2]).text().trim();
                let balls = $(allCols[3]).text().trim();
                let fours = $(allCols[5]).text().trim();
                let sixes = $(allCols[6]).text().trim();
                let sr = $(allCols[7]).text().trim();
                console.log(playerName+" "+runs+" "+balls+" "+fours+" "+sixes+" "+sr);

                processPlayer(teamName,playerName,runs,balls,fours,sixes,sr,opponentName,venue,date,result);
            }

        }
        // console.log(teamName+" "+opponentName);

 
    }
}


function processPlayer(teamName,playerName,runs,balls,fours,sixes,sr,opponentName,venue,date,result){
    
    let teamPath = path.join(__dirname,"ipl",teamName); // dircreater me agar folder nhi hai toh bana dega varna koi dikkat nhi hai

    dirCreater(teamPath);
    let filepath = path.join(teamPath,playerName+".xlsx");
    let content  = excelReader(filepath,playerName); // mann liya content ek empty array aaya usko hum object ke form me print karenge
    
    
    let playerObj = {
        teamName,   
        playerName,
        runs,balls,fours,
        sixes,
        sr,
        opponentName,
        venue,date,
        result
    }
    
    content.push(playerObj);
    excelWriter(filepath,content,playerName); // sheetname me playername daal dia

    // dirCreater se directory nhi toh bana di phir content read kara nhi hoga toh apne aap me empty array de dega uske baad empty array aaya toh usme data put kia aur write kara dia toh voh replace ho jayega
    // next time same banda kahin aur match me khel rha tha toh uske array me ek entry hogi toh voh entr update 
    // ho jayegi and usse file bhi update ho jayegi 
}

module.exports ={
    ps:processScoreCard
}


function dirCreater(filepath){
    if(fs.existsSync(filepath)==false){
        fs.mkdirSync(filepath);
    }
    
}

function excelWriter(filepath,json,sheetName){
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB,newWS,sheetName);
    xlsx.writeFile(newWB,filepath);
}

function excelReader(filepath,sheetName){
    if(fs.existsSync(filepath)==false){
        return [];
    }

    let wb = xlsx.readFile(filepath);
    let excelData = wb.Sheets[sheetName];
    let ans= xlsx.utils.sheet_to_json(excelData);
    return ans;
}

