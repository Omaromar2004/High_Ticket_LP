const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const { generateAgreementHTML, getExecutablePath } = require('./template');

const CLAUSE_15K = `The Client agrees to pay a one-time service fee of ₹29,899/- (Twenty-Nine Thousand Eight Hundred Ninety-Nine Only). This fee includes the above-mentioned product inventory. Advertising budget is not included and shall be borne solely by the Client. The payment shall be made in the following schedule: Initial Payment: ₹15,000/- (Fifteen Thousand Only) to be paid upon signing this Agreement, in order to confirm the Client’s seat. Remaining Balance: ₹14,899/- (Fourteen Thousand Eight Hundred Ninety-Nine Only) to be paid by the Client to start the program. Services shall commence only after the full service fee has been received.`;

const CLAUSE_30K = `The Client agrees to pay a one-time service fee of ₹29,899/- (Twenty-Nine Thousand Eight Hundred Ninety-Nine Only). This fee includes the above-mentioned product inventory. Advertising budget is not included and shall be borne solely by the Client. Payment must be made in full in advance before commencement of services.`;

const AGREEMENT_DATE = '30th August 2026';

function parseCSV(content) {
  const lines = content.trim().split('\n');
  const results = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const pattern = /(?:^|,)(\"(?:[^\"]+|\"\")*\"|[^,]*)/g;
    let match;
    const row = [];
    while ((match = pattern.exec(line)) !== null) {
      let val = match[1];
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1).replace(/""/g, '"');
      }
      row.push(val.trim());
      if (match.index === pattern.lastIndex) pattern.lastIndex++;
      if (row.length >= 8) break;
    }

    if (row.length >= 8) {
      results.push({
        timestamp: row[0],
        name: row[1],
        gender: row[2],
        email: row[3],
        contact: row[4],
        adSpends: row[5],
        startTimeline: row[6],
        paymentOption: row[7]
      });
    }
  }
  return results;
}

function sanitizeFilename(name) {
  return name.replace(/[\\/:*?"<>|]/g, '_').replace(/\s+/g, ' ').trim();
}

async function run() {
  const csvPath = path.join(__dirname, 'data.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const rows = parseCSV(csvContent);

  console.log(`Parsed ${rows.length} records from CSV.`);

  const outputDesktopDir = 'C:\\Users\\Mohammed Aqib\\Desktop\\Agreements_FiqrTaalim';
  const outputLocalDir = path.join(__dirname, '..', 'generated_agreements');

  if (!fs.existsSync(outputDesktopDir)) fs.mkdirSync(outputDesktopDir, { recursive: true });
  if (!fs.existsSync(outputLocalDir)) fs.mkdirSync(outputLocalDir, { recursive: true });

  const browserPath = getExecutablePath();
  console.log('Launching browser with:', browserPath);

  const browser = await puppeteer.launch({
    executablePath: browserPath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-extensions']
  });

  const page = await browser.newPage();
  page.setDefaultTimeout(10000);

  const manifest = [];
  const filenameCount = {};

  for (let i = 0; i < rows.length; i++) {
    const record = rows[i];
    const rawName = record.name || 'Client';
    const cleanName = rawName.replace(/\s+/g, ' ').trim();
    
    // Determine payment clause
    let paymentClause = CLAUSE_15K;
    let paymentType = '15,000 (Half Payment)';
    
    if (record.paymentOption.includes('29,899') || record.paymentOption.toLowerCase().includes('full')) {
      paymentClause = CLAUSE_30K;
      paymentType = '29,899 (Full Payment)';
    }

    // Generate unique safe filename
    const safeName = sanitizeFilename(cleanName) || `Client_${i+1}`;
    let baseFileName = `Agreement - ${safeName}`;
    
    if (filenameCount[baseFileName]) {
      filenameCount[baseFileName]++;
      baseFileName = `${baseFileName} (${filenameCount[baseFileName]})`;
    } else {
      filenameCount[baseFileName] = 1;
    }

    const pdfFileName = `${baseFileName}.pdf`;
    const desktopPdfPath = path.join(outputDesktopDir, pdfFileName);
    const localPdfPath = path.join(outputLocalDir, pdfFileName);

    const htmlContent = generateAgreementHTML(cleanName, AGREEMENT_DATE, paymentClause);

    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded', timeout: 5000 });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0px', bottom: '0px', left: '0px', right: '0px' }
    });

    fs.writeFileSync(desktopPdfPath, pdfBuffer);
    fs.writeFileSync(localPdfPath, pdfBuffer);

    manifest.push({
      index: i + 1,
      name: cleanName,
      email: record.email,
      contact: record.contact,
      paymentType: paymentType,
      fileName: pdfFileName,
      desktopPath: desktopPdfPath
    });

    if ((i + 1) % 10 === 0 || i + 1 === rows.length) {
      console.log(`Progress: [${i + 1}/${rows.length}] agreements generated.`);
    }
  }

  await browser.close();

  // Save manifest summary report
  const reportPath = path.join(outputDesktopDir, 'Summary_Manifest.json');
  fs.writeFileSync(reportPath, JSON.stringify(manifest, null, 2), 'utf8');

  // Save CSV manifest
  const csvReportPath = path.join(outputDesktopDir, 'Summary_Manifest.csv');
  const csvHeader = 'Index,Name,Email,Contact,Payment_Type,Filename\n';
  const csvRows = manifest.map(m => `${m.index},"${m.name}","${m.email}","${m.contact}","${m.paymentType}","${m.fileName}"`).join('\n');
  fs.writeFileSync(csvReportPath, csvHeader + csvRows, 'utf8');

  console.log(`\n🎉 Successfully generated all ${manifest.length} agreements!`);
  console.log(`Desktop Folder: ${outputDesktopDir}`);
}

run().catch(err => {
  console.error('Error generating agreements:', err);
  process.exit(1);
});
