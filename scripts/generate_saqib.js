const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const { generateAgreementHTML, getExecutablePath } = require('./template');

const CLAUSE_30K = `The Client agrees to pay a one-time service fee of ₹29,899/- (Twenty-Nine Thousand Eight Hundred Ninety-Nine Only). This fee includes the above-mentioned product inventory. Advertising budget is not included and shall be borne solely by the Client. Payment must be made in full in advance before commencement of services.`;

const AGREEMENT_DATE = '30th August 2026';
const CLIENT_NAME = 'Saqib Islam';

async function generateSingle() {
  const outputDesktopDir = 'C:\\Users\\Mohammed Aqib\\Desktop\\Agreements_FiqrTaalim';
  const outputLocalDir = path.join(__dirname, '..', 'generated_agreements');

  const browserPath = getExecutablePath();
  const browser = await puppeteer.launch({
    executablePath: browserPath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  const htmlContent = generateAgreementHTML(CLIENT_NAME, AGREEMENT_DATE, CLAUSE_30K);

  await page.setContent(htmlContent, { waitUntil: 'domcontentloaded', timeout: 5000 });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '0px', bottom: '0px', left: '0px', right: '0px' }
  });

  const fileName = `Agreement - Saqib Islam.pdf`;
  const desktopPdfPath = path.join(outputDesktopDir, fileName);
  const localPdfPath = path.join(outputLocalDir, fileName);

  fs.writeFileSync(desktopPdfPath, pdfBuffer);
  fs.writeFileSync(localPdfPath, pdfBuffer);

  await browser.close();

  console.log(`Generated: ${desktopPdfPath}`);
}

generateSingle().catch(console.error);
