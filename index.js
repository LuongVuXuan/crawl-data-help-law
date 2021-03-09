const { chromium } = require("playwright");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const BASE_URL = "https://hoidap.thuvienphapluat.vn/tim-theo-tu-van.html";

// Easy to Divide to run many times
const START_INDEX = 1;
const END_INDEX = 10; // max INDEX of this page is 12383

// Init records to write
const records = [];
// Init CSV name, path and columns of Writer
const csvWriter = createCsvWriter({
  path: "file.csv",
  header: [
    { id: "title", title: "TITLE" },
    { id: "question", title: "QUESTION" },
    { id: "answer", title: "ANSWER" },
  ],
});

async function main() {
  // Init browser to crawl
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // For loop all page of link base
  for (let index = START_INDEX; index <= END_INDEX; index++) {
    console.log(`-----------Page ${index}----------`);
    await page.goto(BASE_URL + `?page=${index}`);
    const urls = await page.$$eval("a.tieu-de", (elements) =>
      elements.map((el) => el.href)
    );
    for (let index = 0; index < urls.length; index++) {
      try {
        const url = urls[index];
        const pageCrawl = await browser.newPage();
        await pageCrawl.goto(url);
        const title = await pageCrawl.innerText(".fix-right h1");
        const question = await pageCrawl.innerText(
          ".fix-right .alert-warning p"
        );
        const answer = await pageCrawl.innerText("#cautraloi");
        const record = [{ title, question, answer }];
        await csvWriter.writeRecords(record);
        console.log(`Done link ${index}`);
        await pageCrawl.close();
      } catch (error) {
        continue;
      }
    }
  }
  console.log("Crawl Done!");
  await browser.close();
}

main();
