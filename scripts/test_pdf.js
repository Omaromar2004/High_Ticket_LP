const puppeteer = require('puppeteer-core');
const fs = require('fs');
const { generateAgreementHTML, getExecutablePath } = require('./template');

async function testPdf() {
  const browser = await puppeteer.launch({
    executablePath: getExecutablePath(),
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });
  const page = await browser.newPage();
  const html = generateAgreementHTML('Mohammed Farhan', '12th September 2026', 'Paid 15,000');
  await page.setContent(html, { waitUntil: 'domcontentloaded' });
  const buffer = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();
  console.log('PDF generated successfully, size:', buffer.length);
}

testPdf().catch(console.error);
