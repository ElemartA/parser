
const result = require('./belta');

let path = process.cwd();




const arrayIndex = [16];

const { Builder, By, Key, util } = require('selenium-webdriver');


async function createNews() {
    let driver = await new Builder().forBrowser('firefox').build();

    await driver.get('https://сайт/login/'); //вход в админку сайта
    await driver.findElement(By.xpath('//*[@id="id_username"]')).sendKeys('login');
    await driver.findElement(By.xpath('//*[@id="id_password"]')).sendKeys('password');
    await driver.findElement(By.xpath('//*[@id="submit-id-"]')).click();
    driver.sleep(11000);

    await driver.findElement(By.xpath('//*[@id="header-main-block"]/div[9]/div[2]/p[2]/a[1]')).click(); // вход в личный кабинет
    await driver.findElement(By.xpath('//*[@id="content-main"]/div/table/tbody/tr[12]/th/a')).click(); // новости портала
                                        
    for (i of arrayIndex) {
        await driver.sleep(7000)
        await driver.findElement(By.xpath('//*[@id="content-main"]/ul/li/a')).click(); // добавить новость портала
                                            
        async function getTags(url) { // функция, которая ищет все теги на странице 
            const tags = await driver.findElements(By.className('taggit-tag'));
            const arrayNew = [];
            const newArrayTags = Array.from(tags);
            for (tag of newArrayTags) {
                let tagItem = await tag.getText();
                arrayNew.push(tagItem);
            }
            return arrayNew;
        }

        async function run() { // запуск функции getTags для страницы https://сайт собирает теги со страницы в админке
            const data = await getTags('https:/путь');
            return data;
        }
 
        const mobileArrayTags = await run();  //массив тегов нашего сайта
        const beltaArrayTags = result[i].tags; // массив тегов со страницы отдельной новости на belta.by

        // for (let n = 0; n < beltaArrayTags.length; n++) { //находим совпадающие теги в двух массивах
        //     for (let b = 0; b < mobileArrayTags.length; b++) {
        //         if (beltaArrayTags[n] === mobileArrayTags[b]) {
        //            // driver.findElement(By.xpath("//li[contains(text(),'" + beltaArrayTags[n] +"')]")).click(); // ищет теги по текстовому содержимому
        //             driver.findElement((By.css(`li[data-tag-name = '${beltaArrayTags[n]}']`))).click();  //ищет теги по scc
        //             console.log(beltaArrayTags[n])
        //         } 
        //     }
        // }
      
        const tagsToAdd = beltaArrayTags.filter(j => mobileArrayTags.indexOf(j) === -1); //сравниваем массивы тегов и находим те, которых у нас нет
        console.log(tagsToAdd);                                                          //tagsToAdd - это массив


        var parent = driver.getWindowHandle(); // Сохраняем текущий дескриптор окна
        
        if (tagsToAdd.length != 0) {
            for (el of tagsToAdd){
            await driver.findElement(By.xpath('//*[@id="add_id_tags"]')).click(); // кликаем на кнопку добавления нового тега

            driver.getAllWindowHandles().then(function gotWindowHandles(allhandles) { // Переключение в новое открытое окно
                driver.switchTo().window(allhandles[allhandles.length - 1]);  
            });
    
                await driver.sleep(2000);
                await driver.findElement(By.xpath('//*[@id="id_name"]')).sendKeys(el)
                await driver.sleep(1000);
                await driver.findElement(By.xpath('//*[@id="tag_form"]/div/div[2]/input')).click(); // кликаем на сохранить

           
            driver.getAllWindowHandles().then(function gotWindowHandles(allhandles) { // Переключение в старое открытое окно
                driver.switchTo().window(allhandles[0]);  
            });

            //await driver.switchTo().window(parent); // Вернуться к исходному браузеру (первое окно)
            await driver.sleep(3000);
            
        }
    }

       
    for (let n = 0; n < beltaArrayTags.length; n++) { //находим совпадающие теги в двух массивах
               // driver.findElement(By.xpath("//li[contains(text(),'" + beltaArrayTags[n] +"')]")).click(); // ищет теги по текстовому содержимому
                driver.findElement((By.css(`li[data-tag-name = '${beltaArrayTags[n]}']`))).click();  //ищет теги по scc
                console.log(beltaArrayTags[n])
             
    }

                                                          

        await driver.findElement(By.xpath('//*[@id="id_title"]')).sendKeys(result[i].title);  // вставляем заголовок
        await driver.findElement(By.xpath('//*[@id="id_categories"]/li[1]/span/a/i')).click(); // клик на категорию +Новости

        // driver.sleep(10000);

        // let auto = await driver.findElement(By.xpath('//*[@id="chindren-of-1883"]/li[1]/span/label')).getText();
        // let business = await driver.findElement(By.xpath('//*[@id="chindren-of-1883"]/li[2]/span/label')).getText();
        // let belarus = await driver.findElement(By.xpath('//*[@id="chindren-of-1883"]/li[3]/span/label')).getText();
        // let world = await driver.findElement(By.xpath('//*[@id="chindren-of-1883"]/li[4]/span/label')).getText();
        // let children = await driver.findElement(By.xpath('//*[@id="chindren-of-1883"]/li[5]/span/label')).getText();
        // let helth = await driver.findElement(By.xpath('//*[@id="chindren-of-1883"]/li[6]/span/label')).getText();
        // let ledy = await driver.findElement(By.xpath('//*[@id="chindren-of-1883"]/li[7]/span/label')).getText();
        // let realt = await driver.findElement(By.xpath('//*[@id="chindren-of-1883"]/li[8]/span/label')).getText();
        // let nature = await driver.findElement(By.xpath('//*[@id="chindren-of-1883"]/li[9]/span/label')).getText();
        let incidents = await driver.findElement(By.xpath('//*[@id="chindren-of-1883"]/li[10]/span/label')).getText();
        //let pcyhology = await driver.findElement(By.xpath('//*[@id="chindren-of-1883"]/li[11]/span/label')).getText();
        let sport = await driver.findElement(By.xpath('//*[@id="chindren-of-1883"]/li[12]/span/label')).getText();
        let technology = await driver.findElement(By.xpath('//*[@id="chindren-of-1883"]/li[13]/span/label')).getText();
        // let tourizm = await driver.findElement(By.xpath('//*[@id="chindren-of-1883"]/li[14]/span/label')).getText();
        // let showBiz = await driver.findElement(By.xpath('//*[@id="chindren-of-1883"]/li[15]/span/label')).getText();

        if(result[i].rubric == 'Общество'){
            (await driver.findElement(By.xpath('//*[@id="chindren-of-1883"]/li[3]/span/input'))).click(); // в Беларуси
        } else if(result[i].rubric == 'Регионы'){
            (await driver.findElement(By.xpath('//*[@id="chindren-of-1883"]/li[3]/span/input'))).click(); // в Беларуси
        } else if(result[i].rubric == incidents){
            (await driver.findElement(By.xpath('//*[@id="chindren-of-1883"]/li[10]/span/input'))).click(); // Проиcшествия
        } else if(result[i].rubric == technology) {
            (await driver.findElement(By.xpath('//*[@id="chindren-of-1883"]/li[13]/span/input'))).click(); // Технологии
        } else if(result[i].rubric == 'Культура') {
            (await driver.findElement(By.xpath('//*[@id="chindren-of-1883"]/li[3]/span/input'))).click(); // Культура
        } else if(result[i].rubric == sport) {
            (await driver.findElement(By.xpath('//*[@id="chindren-of-1883"]/li[12]/span/input'))).click(); // Спорт
        } else if(result[i].rubric == 'Афиша') {
            (await driver.findElement(By.xpath('//*[@id="chindren-of-1883"]/li[3]/span/input'))).click(); // в Беларуси
        } else if(result[i].rubric == 'Президент') {
            (await driver.findElement(By.xpath('//*[@id="chindren-of-1883"]/li[3]/span/input'))).click(); // в Беларуси
        } else if(result[i].rubric == 'Политика') {
            (await driver.findElement(By.xpath('//*[@id="chindren-of-1883"]/li[3]/span/input'))).click(); // в Беларуси
        } else if(result[i].rubric == 'Экономика') {
            (await driver.findElement(By.xpath('//*[@id="chindren-of-1883"]/li[3]/span/input'))).click(); // в Беларуси
        } else {
            (await driver.findElement(By.xpath('//*[@id="chindren-of-1883"]/li[4]/span/input'))).click(); // в мире
        }


        await driver.findElement(By.xpath('//*[@id="id_description"]')).sendKeys(result[i].text_small);
        await driver.findElement(By.xpath('//*[@id="newsmb_form"]/div/fieldset/div[9]/div/p/span[1]/a[1]')).click();  // дата
        await driver.findElement(By.xpath('//*[@id="newsmb_form"]/div/fieldset/div[9]/div/p/span[2]/a[1]')).click(); // время


        await driver.switchTo().frame(0);
        await driver.findElement(By.xpath('//*[@id="tinymce"]/p')).click();
        await driver.findElement(By.xpath('//*[@id="tinymce"]')).sendKeys(result[i].text.split('. ').map(p=> p.split('\n')).join('.\n'));
        await driver.switchTo().defaultContent();

        await driver.findElement(By.xpath('//*[@id="id_is_active"]')).click(); //галка опубликовано



        await driver.findElement(By.xpath('//*[@id="id_source_text"]')).sendKeys('belta.by');
        await driver.findElement(By.xpath('//*[@id="id_source_url"]')).sendKeys('https://www.belta.by/');



        await driver.findElement(By.xpath('//*[@id="id_image"]')).sendKeys(path + `\\img\\${(result[i].imgName)}`);
        driver.sleep(2000);


        
        if ((result[i].imgAutor == "")){
            await driver.findElement(By.xpath('//*[@id="id_image_author"]')).sendKeys('из архива') 
        } else {
            await driver.findElement(By.xpath('//*[@id="id_image_author"]')).sendKeys((result[i].imgAutor))
        }

        await driver.findElement(By.xpath('//*[@id="newsmb_form"]/div/div[3]/input[1]')).click();
        driver.sleep(15000);
    
    }
}
createNews();
