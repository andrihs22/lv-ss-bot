const TelegramBot = require('node-telegram-bot-api');
const RSSParser = require('rss-parser');
const parser = new RSSParser();
const TOKEN = process.env.TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const bot = new TelegramBot(TOKEN, { polling: false });

const RSS = 'https://www.ss.lv/lv/rss/rss.xml';
const keywords = ['5800X3D','RTX 3070','RX 6700 XT','3060 Ti','5700X'];
let seen = new Set();

async function checkRSS(){
  try{
    const feed = await parser.parseURL(RSS);
    for(const item of feed.items){
      const title = item.title.toUpperCase();
      if(keywords.some(k=>title.includes(k))){
        const key = item.link;
        if(seen.has(key)) continue;
        seen.add(key);
        const msg = `🎯 Jauns hits!\n${item.title}\n${item.link}`;
        await bot.sendMessage(CHAT_ID, msg);
      }
    }
  }catch(e){console.error(e);}
}

setInterval(checkRSS, 5 * 60 * 1000);
checkRSS();
