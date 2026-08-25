const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  await page.goto('http://localhost:4200', { waitUntil: 'load' });
  await page.screenshot({ path: 'C:/Users/AVINASH/.gemini/antigravity-ide/brain/f6f11ca7-6f3e-45fa-af95-1ca8676a0876/screenshot.jpg' });
  
  await browser.close();
  console.log('Screenshot saved.');
})();
