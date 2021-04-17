const parser = require ('./parser.js');
const saveImg = require ('./saveImg.js')

async function start1 () {
    try {
        await parser('https://www.belta.by/all_news');
        //await saveImg();
            
       
    } catch (e){
        console.log(e);
    }
    // process.exit(0);
}

start1();




