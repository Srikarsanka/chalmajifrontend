const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  await page.goto('http://localhost:4200', { waitUntil: 'load' });
  
  // Scroll down to the about section
  await page.evaluate(() => {
    window.scrollBy(0, 800);
  });
  
  // Wait a second for animations
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await page.screenshot({ path: 'C:/Users/AVINASH/.gemini/antigravity-ide/brain/f6f11ca7-6f3e-45fa-af95-1ca8676a0876/screenshot_scroll.jpg' });
  
  await browser.close();
  console.log('Scrolled screenshot saved.');
})();
