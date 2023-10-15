#!/usr/local/bin/node

const puppeteer = require('puppeteer');
const nodemailer = require("nodemailer");
require("dotenv").config();

const mailFrom = process.env.MAILFROM
const mailTo = process.env.MAILTO

console.log(mailFrom);

const smtpOption = {
    service:"gmail.com",
    //gmailの場合はservice,他メールサーバはhostで定義する
    port:465,
    secure:true,
    auth: {
        user:process.env.MAILFROM,
        pass:process.env.MAILPASS
    },
    tls: {
        rejectUnauthorized: false,
    },
}

async function getScryping() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://www.google.com');
    await page.waitForSelector(".gb_E")
    let rows = await page.$$(".gb_E");

    let result = []

    for(let i=0;i<rows.length;i++) {
        result.push(await page.evaluate(rows => rows.textContent,rows[i]))
    }

    await browser.close();
    return result;
}

async function sendMail(result) {
    const mail = {
        from: mailFrom,
        to: mailTo,
        subject: "test",
        text: result[0]
    }
    try {
        const transport = nodemailer.createTransport(smtpOption);
        await transport.sendMail(mail)
    } catch(e) {
        console.error(e);
    }
}

(async()=>{
    const result = await getScryping();
    sendMail(result);
})();
