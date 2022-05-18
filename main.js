const puppeteer = require("puppeteer");
const cron = require("node-cron");
const fs = require("fs");

const url = "https://nazarpashazade.github.io/demo-pages-for-puppeteer-nodejs";

const start = async() => {
    const browser = await puppeteer.launch({ headless: false });

    const page = await browser.newPage();

    await page.goto(url);

    // await makeScreenshots(page);

    // await writeTitlesToFile(page);

    // await uploadImagesToLocal(page);

    await readData(page);

    // await readDataFromNewPage(page);

    await browser.close();
};

// ------ Normal
start();

// ------ 1) Using cron to repeat
// cron.schedule("*/5 * * * * *", start);

// ------ 2) Using setInterval to repeat
// setInterval(start, 5000);

const readData = async(page) => {
    await page.click("#clickme");

    const text = await page.$eval("#data", (n) => n.textContent);

    console.log(text);
};

const readDataFromNewPage = async(page) => {
    await page.type("#ourfield", "blue");

    await Promise.all([page.click("#ourform button"), page.waitForNavigation()]);

    const text = await page.$eval("#message", (n) => n.textContent);

    console.log(text);
};

//  ---  Make screenshots
const makeScreenshots = async(page) => {
    await page.screenshot({ path: "results/images/page.jpeg" });

    await page.screenshot({
        path: "results/images/page_full.png",
        fullPage: true
    });
};

//  ---  Write titles(image) to .txt file
const writeTitlesToFile = async(page) => {
    const titles = await page.evaluate(() => {
        const nodes = document.querySelectorAll(".info strong");
        return Array.from(nodes, (n) => n.textContent);
    });

    const path = `results/titles.txt`;

    await fs.writeFileSync(path, titles.join("\n"));
};

//  ---  Upload Images to local folder
const uploadImagesToLocal = async(page) => {
    const urls = await page.$$eval("img", (imgs) => imgs.map((x) => x.src));

    for (const url of urls) {
        const imageName = url.split("/").pop();

        const path = `results/images/${imageName}`;

        const imagePage = await page.goto(url);

        const imageBuffer = await imagePage.buffer();

        await fs.writeFileSync(path, imageBuffer);
    }
};