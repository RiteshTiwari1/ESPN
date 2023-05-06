const request = require("request");
const cheerio = require("cheerio");
const scoreCardObj = require("./scoreCards");


function getAllMatchesLink(url){

    request(url,function(err,request,html){
        if(err){
            console.log(err);
        }else{
            extractAllLinks(html);
        }
    })
}

function extractAllLinks(html){
    let $ = cheerio.load(html); 
    let scoreCardsElems = $(".ds-grow.ds-px-4.ds-border-r.ds-border-line-default-translucent >a");
    for(let i=0;i<scoreCardsElems.length;i++){
        let link = $(scoreCardsElems[i]).attr("href");
        // console.log(link);
        let fullLink = "https://www.espncricinfo.com"+link;
        console.log(fullLink);
        scoreCardObj.ps(fullLink);

    }


}

function dirCreater(filepath){
    if(fs.existsSync(filepath)==false){
        fs.mkdirSync(filepath);
    }
    
}



module.exports ={
    gAlmatches:getAllMatchesLink
}