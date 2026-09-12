const fs = require('fs');
const path = require('path');

const EXCLUDED_EMAILS = new Set([
  'sanaullah6920@gmail.com',
  'sazim362@gmail.com',
  'imranchand2908@gmail.com',
  'atifsquash79@gmail.com',
  'balwa199393@gmail.com',
  'kahmed1285@gmail.com',
  'ismailmd6989@gmail.com',
  'latiefdar786@yahoo.com',
  'pharmadealnanded@gmail.com',
  'aaman463@gmail.com',
  'ims.almas@gmail.com',
  'muheebahmadpbh@gmail.com',
  'quamarraz70@gmail.com',
  'yusuf.s.khan46@gmail.com'
].map(e => e.toLowerCase().trim()));

const EXCLUDED_PHONES = new Set([
  '7991139929',
  '7209039486',
  '9632704783',
  '9910025980',
  '8424834467',
  '7975034821',
  '9014242776',
  '6005383704',
  '9890835663',
  '9829333177',
  '9686247192',
  '9918626449',
  '9608885192',
  '8080070822'
]);

function cleanPhone(p) {
  if (!p) return '';
  const digits = p.replace(/\D/g, '');
  if (digits.length === 10) return digits;
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits;
}

const manifestPath = 'C:\\Users\\Mohammed Aqib\\Desktop\\Agreements_FiqrTaalim\\Summary_Manifest.json';
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

let excludedCount = 0;
let validReadyCount = 0;
let invalidCount = 0;

const toSend = [];
const excludedList = [];

manifest.forEach((item, i) => {
  const email = (item.email || '').trim().toLowerCase();
  const phone = cleanPhone(item.contact);
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!isValidEmail) {
    invalidCount++;
    return;
  }

  if (EXCLUDED_EMAILS.has(email) || EXCLUDED_PHONES.has(phone)) {
    excludedCount++;
    excludedList.push({ index: i + 1, name: item.name, email: item.email, contact: item.contact });
  } else {
    validReadyCount++;
    toSend.push(item);
  }
});

console.log('--- EXCLUSION FILTER ANALYSIS ---');
console.log('Total records in manifest:', manifest.length);
console.log('Excluded matching requested list:', excludedCount);
console.log('Invalid/placeholder emails (e.g. "Ok", "Khan"):', invalidCount);
console.log('Active verified recipients to receive emails:', validReadyCount);
console.log('\nExcluded contacts details:');
console.log(JSON.stringify(excludedList, null, 2));
