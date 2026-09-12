const nodemailer = require('nodemailer');
const fs = require('fs');

const transporter = nodemailer.createTransport({
  host: 'smtp.zeptomail.in',
  port: 465,
  secure: true,
  auth: {
    user: 'emailapikey',
    pass: 'PHtE6r1YRu7r3mAm8BAJtKe6QMKtPI4n+OpufVZOsYpBC6QBTU1d/d4okGSwrRcvB/BCEPHKy4Jo4r+f5erXcT65NmcfXGqyqK3sx/VYSPOZsbq6x00etVsdfk3eUI/scdRq3CDfv9nbNA=='
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error('ZeptoMail Connection Failed:', error.message);
    fs.writeFileSync('C:\\Users\\Mohammed Aqib\\.gemini\\antigravity\\brain\\07102a37-17f0-45ae-91bb-1356ab813fc1\\scratch\\zepto_test.txt', 'FAILED: ' + error.message, 'utf8');
    process.exit(1);
  } else {
    console.log('✅ ZeptoMail SMTP Connection Successful!');
    fs.writeFileSync('C:\\Users\\Mohammed Aqib\\.gemini\\antigravity\\brain\\07102a37-17f0-45ae-91bb-1356ab813fc1\\scratch\\zepto_test.txt', 'SUCCESS: SMTP Server ready', 'utf8');
    process.exit(0);
  }
});
