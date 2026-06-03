import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('or-theme', 'light');
    });

    await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle0' });
    
    const elements = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('*'));
      return els.filter(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width > 200 && rect.height > 10 && rect.height < 100) {
          const style = window.getComputedStyle(el);
          return style.background.includes('linear-gradient') || style.backgroundColor.includes('rgba(245') || style.background.includes('182');
        }
        return false;
      }).map(el => ({
        html: el.outerHTML.substring(0, 300),
        rect: el.getBoundingClientRect(),
        bg: window.getComputedStyle(el).background
      }));
    });
    
    console.log(JSON.stringify(elements, null, 2));
    await browser.close();
  } catch (err) {
    console.error(err);
  }
})();
