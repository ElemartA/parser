const request = require('request');
const fs = require('fs');
const https = require('https');
const { pipeline } = require('stream');
const result = require('./belta');



      
       for (const element of result) {
            if (element.imgName !== 'undefined') {
                const file = fs.createWriteStream(`./img/${element.imgName}`);
                https.get(`${element.imgBigUrl}`, function (response) {
                    response.pipe(file);
                })
            }
        }
    
     



