const { chromium } = require("playwright");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const BASE_URL = "https://hoidap.thuvienphapluat.vn/tim-theo-tu-van.html";

// Easy to Divide to run many times
let START_INDEX = 1;
let END_INDEX = 100; // max INDEX of this page is 12383
let THREAD = 10;
let MAX_TIMEOUT = 100; // milliseconds

// Get params from command line
process.argv.forEach(function (val, index, array) {
  if (index == 2) START_INDEX = parseInt(val);
  if (index == 3) END_INDEX = parseInt(val);
  if (index == 4) THREAD = parseInt(val);
});

// Init CSV name, path and columns of Writer
const csvWriter = createCsvWriter({
  path: "file.csv",
  header: [
    { id: "title", title: "TITLE" },
    { id: "question", title: "QUESTION" },
    { id: "answer", title: "ANSWER" },
  ],
});

async function main(start, end, thread = 1) {
  // Init browser to crawl
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // For loop all page of link base
  for (let index = start; index <= end; index++) {
    await page.goto(BASE_URL + `?page=${index}`);
    const urls = await page.$$eval("a.tieu-de", (elements) =>
      elements.map((el) => el.href)
    );
    for (let i = 0; i < urls.length; i++) {
      try {
        const url = urls[i];
        const pageCrawl = await browser.newPage();
        await pageCrawl.goto(url);

        const title = await pageCrawl.innerText(".fix-right h1", {
          timeout: MAX_TIMEOUT,
        });
        if (title) {
          const question = await pageCrawl.innerText(
            ".fix-right .alert-warning p"
          );
          const answer = await pageCrawl.innerText("#cautraloi");
          const record = [{ title, question, answer }];
          await csvWriter.writeRecords(record);
        }
        console.log(`Done link ${i + 1} - page ${index} - thread ${thread}`);
        await pageCrawl.close();
      } catch (error) {
        continue;
      }
    }
  }
  console.log(`^-^ Crawl Thread ${thread} Done!`);
  await browser.close();
}

function doCrawl(start, end, thread) {
  const jump = Math.floor((end - start + 1) / thread);
  for (let index = 0; index < thread; index++) {
    main(
      start + (jump - 1) * index + index,
      start + (jump - 1) * (index + 1) + index,
      index + 1
    );
  }
}

doCrawl(START_INDEX, END_INDEX, THREAD);
/*
  VD: 1 - 100 - 10
  i runs from 0 - 9
  1-10: 1 + i * ()
  11-20
  ...
 */
