const request = require('request');
const cheerio = require('cheerio');
const moment = require('moment');
const readline = require('readline');
const fs = require('fs');
const https = require('https');
const { pipeline } = require('stream');



const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//функция, которая будет задавать вопрос пользователю в консоле
async function askQuestion(question) {
    return new Promise(resolve => {
        rl.question(question, (answer) => {
            if (!answer || answer === 'y') {
                return resolve(true);
            }
            return resolve(false);

        });
    })
}

//функция , которая будет получать код страницы и возвращать объект чирио(cheerio), с помощью которого мы будем работать с ДОМОМ
//добавляем User-Agent, чтобы нас не определили как бота

async function getPage(url) {
    return new Promise((resolve, reject) => {
        request({
            url: url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.13 (KHTML, like Gecko) Chrome/24.0.1290.1 Safari/537.13'
            }
        }, (error, response, body) => {
            if (error) {
                return reject(error);
            }
            return resolve(cheerio.load(body, { decodeEntities: false }));
        })
    });
}

//функция проходится и ищет на странице новости, затем пытается найти кнопку перехода на следующую страничку, чтобы 
//сделать тоже самое

async function getAdsFromPage(url, page) {
    let result = [];
    const $ = await getPage(url);

    const ads = $('a.contline_sim').each((i, el) => {
        result.push($(el));

    });
    console.log(`Page ${page}: found ${ads.length}`);

    const nextPage = $('a.lista');
    if (nextPage.get(0) && await askQuestion('Next page?')) {
        const nextAds = await getAdsFromPage('https://www.livesport.ru' + nextPage.attr('href'), ++page); //готово
        result = result.concat(nextAds);
    }
    return result;

}

async function getDetails(url) {
    const $ = await getPage(url);
    const text1 = $('div.text p').text();//готово
    const imgBigUrl1 = $('div.news_img_slide img').attr('src');
    const imgName2 = `${imgBigUrl1}`;
    const imgName1 = imgName2.split('/').pop();
    //console.log(imgName1);
    return {
        text: text1,
        imgBigUrl: imgBigUrl1,
        imgName: imgName1
    }
}


async function run(url) {
    const result = [];

    const ads = await getAdsFromPage(url, 1);
    console.log('Total ads found: ' + ads.length);

    
    //ads = ads.splice(0, 3);   
    for (const [i, ad] of ads.entries()) {
        // if (!await askQuestion('Open this ad: ' + ad.find('span.lenta_item_title').text().trim() + '?')){
        //     continue;
        // }
        let numberNews = i;
        let title1 = ad.find('a.contline_sim span li:first-child').text().trim();//готово
        let text_small1 = ad.find('.lenta_textsmall').text().trim();
        let imgSmallUrl1 = ad.find('.lenta_img img').attr('src');
        let href1 = 'https://www.belta.by' + ad.find('a[href*="/view/"]').attr('href');

        let offerData = {
            title: title1,
            text_small: text_small1,
            imgSmallUrl: imgSmallUrl1,
            href: href1,
            number: numberNews
        };

        //const numbers = await getNumber();
        const details = await getDetails(offerData.href);
        offerData = Object.assign(offerData, details);

        result.push(offerData);
    }
    return result;
}



module.exports = async function parser (url) {
    try {
        const result = [];
        // const r = await getPage(url);
        const ads = await run(url);
         console.log(`'${ads[6].imgBigUrl}'`);

        fs.writeFile('belta.json', JSON.stringify(ads, null, 2), function(err){
            if(err) throw err
            console.log ('Saved belta.json file ');
            process.exit(1);    
        })

        for (const element of result) {
            if (element.imgName !== 'undefined') {
                const file = fs.createWriteStream(`./img/${element.imgName}`);
                https.get(`${element.imgBigUrl}`, function (response) {
                    response.pipe(file);

                })
            }
            console.log ('Saved image');
        }
              
    } catch (e) {
        throw e;
    }
}


