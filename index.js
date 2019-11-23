const puppeteer = require('puppeteer-firefox');
require('dotenv').config();

const logIn = async(page) => {

    await page.goto('https://www.instagram.com/accounts/login/?source=auth_switcher');
    
    await page.waitFor(()=>document.querySelectorAll('input').length);

    await page.type('[name=username]',`${process.env.LOGIN}`)    
    await page.type('[name=password]',`${process.env.PASSWORD}`)

    await page.click('button.sqdOP[type="submit"]')
    console.log('logged in')
}

const followTag = async (page) =>{
    await page.waitFor(1000);
    await page.goto('https://www.instagram.com/explore/tags/followforfollow/')

    await page.waitFor(()=>document.querySelector('#react-root > section > main > article > div:nth-child(3) > div > div:nth-child(1) > div:nth-child(1) > a'));
    await page.click('#react-root > section > main > article > div:nth-child(3) > div > div:nth-child(1) > div:nth-child(1) > a');
    console.log('click on photo')
    while (true) {

        try {

            await page.waitForXPath('/html/body/div[3]/div[2]/div/article/header/div[2]/div[1]/div[2]/button[contains(.,"Стежити")]',{timeout:1000})
            await page.click('body > div._2dDPU.vCf6V > div.zZYga > div > article > header > div.o-MQd.z8cbW > div.PQo_0.RqtMr > div.bY2yH > button');

            console.log('find');

            await page.waitFor(()=>document.querySelector('body > div._2dDPU.vCf6V > div.EfHg9 > div > div > a.HBoOv.coreSpriteRightPaginationArrow'),{timeout:1000});
            await page.click('body > div._2dDPU.vCf6V > div.EfHg9 > div > div > a.HBoOv.coreSpriteRightPaginationArrow');
        } catch (error) {
            console.log('next photo');
            await page.click('body > div._2dDPU.vCf6V > div.EfHg9 > div > div > a.HBoOv.coreSpriteRightPaginationArrow');
            
            setTimeout(()=>{
                return followTag(page);
            },6000)

        }

    }
}


const deleteFollowers = async (page) => {

    await page.waitFor(3000);
    await page.goto('https://www.instagram.com/moodplusss/');


    await page.waitFor(()=>document.querySelector('#react-root > section > main > div > header > section > ul > li:nth-child(3) > a'),{timeout:1000});
    await page.click('#react-root > section > main > div > header > section > ul > li:nth-child(3) > a')


    while (true) {
        try {
            //followers
         console.log('1')
 
         //followers unfollow
        // await page.waitForXPath('/html/body/div[3]/div/div[2]/ul/div/li[1]/div/div[3]/button[contains(.,"Following")]',{timeout:1000})
         const linkHandlers = await page.$x('/html/body/div[3]/div/div[2]/ul/div/li[1]/div/div[3]/button[contains(.,"Following")]');
        // await page.click(By.XPath('/html/body/div[3]/div/div[2]/ul/div/li[1]/div/div[3]/button[contains(.,"Following")]'))
         console.log(linkHandlers.length);
         if (linkHandlers.length > 0) {
           await linkHandlers[0].click();
         } else {
           console.log('gnuda ostatna')
         }
        //  await page.waitFor(()=>document.querySelector('body > div.RnEpo.Yx5HN > div > div.isgrP > ul > div > li:nth-child(1) > div > div.Igw0E.rBNOH.YBx95.ybXk5._4EzTm.soMvl > button'),{timeout:1000})
        //  await page.click('body > div.RnEpo.Yx5HN > div > div.isgrP > ul > div > li:nth-child(1) > div > div.Igw0E.rBNOH.YBx95.ybXk5._4EzTm.soMvl > button')
         console.log('2')
 
         //success
         await page.waitFor(()=>document.querySelector('body > div:nth-child(19) > div > div > div.mt3GC > button.aOOlW.-Cab_'),{timeout:1000})
         await page.click('body > div:nth-child(19) > div > div > div.mt3GC > button.aOOlW.-Cab_')
         console.log('3')
         } catch (error) {
             console.log('nextpage');
        //  return deleteFollowers(page);
         
     }
    }
    

 
}

(async () =>{
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();

    await logIn(page);
    // await followTag(page);
    await deleteFollowers(page);
})();



// follow
// body > div._2dDPU.vCf6V > div.zZYga > div > article > header > div.o-MQd.z8cbW > div.PQo_0.RqtMr > div.bY2yH > button
// body > div._2dDPU.vCf6V > div.zZYga > div > article > header > div.o-MQd.z8cbW > div.PQo_0.RqtMr > div.bY2yH > button