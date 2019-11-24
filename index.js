const puppeteer = require('puppeteer');
require('dotenv').config();
const ig = require('instagram-scraping');
// const mongoose = require('mongoose');
const db = require('./db');
const Followers = require('./model');



const scrap = async () => {
    const arr = await  ig.deepScrapeTagPage('followforfollow');
    
    return new Promise(resolve=>{
        var s = []
        arr.medias.forEach(element => {
            s.push(element.owner.username);
        });
        resolve(s);
    })
}


const logIn = async(page) => {

    await page.goto('https://www.instagram.com/accounts/login/?source=auth_switcher');
    
    await page.waitFor(()=>document.querySelectorAll('input').length);

    await page.type('[name=username]',`${process.env.LOGIN}`)    
    await page.type('[name=password]',`${process.env.PASSWORD}`)

    await page.click('button.sqdOP[type="submit"]')
    console.log('logged in')
}



const dbUser = async (users) =>{
    const data = await Followers.findOne({id:1});
    if(data){
        data.followers=users;
        data.deleteFollowers.push(users);
        data.save()
    }
    else{
        const user = new Followers();
        user.id=1;
        user.followers=users;
        user.deleteFollowers.push(users);
        user.save();
    }
    
}
const followersPage = async (page)=>{
    console.log('log')
    const data = await Followers.findOne({id:1});
    for (const username of data.followers) {
        await page.goto('http://instagram.com/'+username);
        await page.waitFor(()=>document.querySelector('#react-root > section > main > div > header > section > div.nZSzR > div.Igw0E.IwRSH.eGOV_._4EzTm > span > span.vBF20._1OSdk > button'));
        await page.click('#react-root > section > main > div > header > section > div.nZSzR > div.Igw0E.IwRSH.eGOV_._4EzTm > span > span.vBF20._1OSdk > button')
        await page.waitFor(1000);
    }
}


const deleteFollower = async (page)=>{
    const data = await Followers.findOne({id:1});
    const toDelete = data.deleteFollowers.shift();
    data.save();
    await page.waitFor(3000);

    for(const username of toDelete){
        // body > div.RnEpo.Yx5HN > div > div > div.mt3GC > button.aOOlW.-Cab_
        // body > div.RnEpo.Yx5HN > div > div > div.mt3GC > button.aOOlW.HoLwm
        try {

            await page.goto('http://instagram.com/'+username);
            await page.waitFor(()=>document.querySelector('#react-root > section > main > div > header > section > div.nZSzR > div.Igw0E.IwRSH.eGOV_._4EzTm > span > span.vBF20._1OSdk > button'),{timeout:3000});
            await page.click('#react-root > section > main > div > header > section > div.nZSzR > div.Igw0E.IwRSH.eGOV_._4EzTm > span > span.vBF20._1OSdk > button')
            await page.waitFor(3000);
           
           
           
            const linkHandlers = await page.$x('/html/body/div[3]/div/div/div[3]/button[1]');
            // await page.click(By.XPath('/html/body/div[3]/div/div[2]/ul/div/li[1]/div/div[3]/button[contains(.,"Following")]'))
             console.log(linkHandlers.length);
             if (linkHandlers.length > 0) {
               await linkHandlers[0].click();
             } else {
               console.log('gnuda ostatna')
             }           
            // await page.waitFor(()=>document.querySelector('body > div.RnEpo.Yx5HN > div > div > div.mt3GC > button.aOOlW.-Cab'),{timeout:3000})
            // await page.click('body > div.RnEpo.Yx5HN > div > div > div.mt3GC > button.aOOlW.-Cab')
            console.log('tadam');
            await page.waitFor(1000);
        } catch (error) {
            console.log('xz xz i ne xz');            
        }
    //     // body > div.RnEpo.Yx5HN > div > div > div.mt3GC > button.aOOlW.-Cab_
    }

}
(async () =>{

    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await logIn(page);
    await scrap().then(x=>dbUser(x)).catch(err=>console.log(err));
    await followersPage(page);   
    await deleteFollower(page);

    // setInterval(async () => {
    //     console.log('inside interval');
    //     await scrap().then(x=>dbUser(x)).catch(err=>console.log(err));
    //     await followersPage(page);   
    //     await deleteFollower(page);
    // }, 3600000);

 
})();
