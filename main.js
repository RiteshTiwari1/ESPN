const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
// venue date opponent result sixes strikeRate
const request = require("request");
const cheerio = require("cheerio");
const AllMatchObj =require("./allMatch");
const fs =require("fs");
const path=require("path");

const iplPath = path.join(__dirname,"ipl");
dirCreater(iplPath);

request(url,cb);
function cb(err,request,html){
    if(err){
        console.log(err);
    }else{
        extractLink(html);
    }

}

function extractLink(html){
    let $ = cheerio.load(html);
    let anchorElem = $(".ds-border-t.ds-border-line.ds-text-center.ds-py-2 >a");
    // console.log($(anchorElem[0]).attr("href"));
    let link = $(anchorElem[0]).attr("href")
    // console.log(link);
    let fullLink = "https://www.espncricinfo.com/"+link;
    // console.log(fullLink);

    AllMatchObj.gAlmatches(fullLink);
}

// function getAllMatchesLink(url){

//     request(url,function(err,request,html){
//         if(err){
//             console.log(err);
//         }else{
//             extractAllLinks(html);
//         }
//     })
// }

// function extractAllLinks(html){
//     let $ = cheerio.load(html); 
//     let scoreCardsElems = $(".ds-grow.ds-px-4.ds-border-r.ds-border-line-default-translucent >a");
//     for(let i=0;i<scoreCardsElems.length;i++){
//         let link = $(scoreCardsElems[i]).attr("href");
//         // console.log(link);
//         let fullLink = "https://www.espncricinfo.com"+link;
//         console.log(fullLink);


//     }
// }


function dirCreater(filepath){
    if(fs.existsSync(filepath)==false){
        fs.mkdirSync(filepath);
    }
    
}
