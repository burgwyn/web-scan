const puppeteer = require('puppeteer');
const { getEdgePath } = require('edge-paths');

(async () => {
  const browser = await puppeteer.launch({ executablePath: getEdgePath() });
  const page = await browser.newPage();

  await page.goto('https://developers.google.com/web/');

  await page.screenshot({ path: 'screenshot_1.png'});

  // Type into search box.
  await page.type('.devsite-search-field', 'Headless Chrome');

  await page.screenshot({ path: 'screenshot_2.png'});

  // Wait for suggest overlay to appear and click "show all results".
  const allResultsSelector = '.devsite-suggest-all-results';
  await page.waitForSelector(allResultsSelector);
  await page.click(allResultsSelector);

  // Wait for the results page to load and display the results.
  const resultsSelector = '.gsc-results .gs-title';
  await page.waitForSelector(resultsSelector);

  await page.screenshot({ path: 'screenshot_3.png'});

  // Extract the results from the page.
  const links = await page.evaluate(resultsSelector => {
    return [...document.querySelectorAll(resultsSelector)].map(anchor => {
      const title = anchor.textContent.split('|')[0].trim();
      return `${title} - ${anchor.href}`;
    });
  }, resultsSelector);

  // Print all the files.
  console.log(links.join('\n'));

  await browser.close();
})();