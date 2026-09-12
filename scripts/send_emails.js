const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const SENDER_EMAIL = 'assistance.fiqrtaalim@gmail.com';
const SENDER_NAME = 'Fiqrtaalim';
const SENDER_PASS = 'uovb axfr hieh vahz'.replace(/\s+/g, '');
const SUBJECT = "Onboarding Confirmation – Let’s Begin Building Your Online Store";

const LINK_FULL = 'https://rzp.io/rzp/M32rMCs9';
const LINK_HALF = 'https://rzp.io/rzp/db1qFEB8';

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

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: SENDER_EMAIL,
    pass: SENDER_PASS
  }
});

function getEmailHTML(name, isFullPayment) {
  const paymentAmountText = isFullPayment ? 'payment of ₹29,899/-' : 'first installment payment of ₹15,000/-';
  const paymentLink = isFullPayment ? LINK_FULL : LINK_HALF;
  
  const balanceSection = isFullPayment ? '' : `
    <p>
      The remaining balance of <strong>₹14,899/-</strong> will be payable as agreed.
    </p>
  `;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>
<body style="margin:0; padding:0; background-color:#f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 6px 18px rgba(0,0,0,0.08); max-width: 600px; width: 100%;">

<!-- Header -->
<tr>
<td style="background:#111827; padding:32px 20px; text-align:center;">
<h2 style="color:#ffffff; margin:0; font-weight:700; font-size:22px; letter-spacing:1px;">FIQRTAALIM</h2>
<p style="color:#d1d5db; margin:8px 0 0 0; font-size:14px; font-weight:400;">
1-1 Mentorship & Service Program
</p>
</td>
</tr>

<!-- Content -->
<tr>
<td style="padding:40px 35px; color:#374151; font-size:15px; line-height:1.7;">

<p style="margin-top:0; font-size:15px;">Dear <strong>${name}</strong>,</p>

<p style="margin:18px 0 10px 0;"><strong>Assalamu Alaikum,</strong></p>

<p style="margin:10px 0;">
We are excited to officially welcome you to 
<strong>Fiqrtaalim’s 1-1 Mentorship & Service Program.</strong>
</p>

<p style="margin:10px 0;">
Please find attached your Service Agreement in PDF format for your reference.
This agreement outlines the complete scope of services, mentorship process, 
inventory details, refund policy, and our commitment to support you until initiation of sales is achieved, InshaAllah.
</p>

<hr style="border:none; border-top:1px solid #e5e7eb; margin:28px 0;">

<h3 style="margin:0 0 14px 0; color:#111827; font-size:17px; font-weight:700;">Payment & Onboarding</h3>

<p style="margin:10px 0;">
To confirm your seat, kindly proceed with the 
<strong>${paymentAmountText}</strong> using the secure payment option below:
</p>

<!-- Payment Button -->
<div style="text-align:center; margin:28px 0;">
<a href="${paymentLink}"
   target="_blank"
   style="background:#2563eb;
          color:#ffffff;
          padding:14px 32px;
          text-decoration:none;
          font-weight:600;
          font-size:15px;
          border-radius:6px;
          display:inline-block;">
Make Secure Payment
</a>
</div>

<p style="text-align:center; font-size:13px; color:#6b7280; margin:10px 0 25px 0;">
If the button does not work, use this link:<br>
<a href="${paymentLink}" target="_blank" style="color:#2563eb; word-break: break-all;">
${paymentLink}
</a>
</p>

<hr style="border:none; border-top:1px solid #e5e7eb; margin:28px 0;">

<h4 style="margin:0 0 12px 0; color:#111827; font-size:15px; font-weight:700;">Alternative Payment Options</h4>

<table width="100%" cellpadding="6" cellspacing="0" style="font-size:14px; color:#374151;">
<tr><td width="38%"><strong>Account Holder:</strong></td><td>FIQR</td></tr>
<tr><td><strong>Account Number:</strong></td><td>50200103923234</td></tr>
<tr><td><strong>IFSC:</strong></td><td>HDFC0002568</td></tr>
<tr><td><strong>Branch:</strong></td><td>K R Mohalla – Mysore</td></tr>
<tr><td><strong>Account Type:</strong></td><td>Current Account</td></tr>
<tr><td><strong>MMID:</strong></td><td>9240276</td></tr>
<tr><td><strong>UPI ID:</strong></td><td>7829208722-3@ybl</td></tr>
<tr><td><strong>UPI Number:</strong></td><td><a href="tel:7829208722" style="color:#2563eb; text-decoration:none;">7829208722</a></td></tr>
</table>

<hr style="border:none; border-top:1px solid #e5e7eb; margin:28px 0;">

${balanceSection}

<p style="margin:12px 0;">
Once the first installment payment is completed, our team will immediately initiate the setup process, including Shopify website development, business account setups, inventory dispatch, and mentorship scheduling.
</p>

<p style="margin:12px 0;">
If you have any queries before making the payment, feel free to reply to this email.
</p>

<p style="margin-top:28px; margin-bottom:15px;">
We look forward to building your brand together and helping you achieve your goals successfully, InshaAllah.
</p>

<p style="margin-top:20px; margin-bottom:0;">
Warm Regards,<br>
<strong style="color:#111827;">Team FIQRTAALIM</strong>
</p>

</td>
</tr>

<!-- Footer -->
<tr>
<td style="background:#f9fafb; padding:18px; text-align:center; font-size:12px; color:#6b7280; border-top:1px solid #f3f4f6;">
© 2026 FIQRTAALIM. All Rights Reserved.
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>`;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendAll(isDryRun = false) {
  const manifestPath = 'C:\\Users\\Mohammed Aqib\\Desktop\\Agreements_FiqrTaalim\\Summary_Manifest.json';
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  const logPath = 'C:\\Users\\Mohammed Aqib\\Desktop\\Agreements_FiqrTaalim\\Sent_Log.json';
  let sentLog = {};
  if (fs.existsSync(logPath)) {
    try {
      sentLog = JSON.parse(fs.readFileSync(logPath, 'utf8'));
    } catch (e) {}
  }

  console.log(`Loaded ${manifest.length} total records from manifest.`);
  if (isDryRun) console.log('--- DRY RUN MODE ACTIVE ---');

  let successCount = 0;
  let excludedCount = 0;
  let skippedInvalidCount = 0;
  let alreadySentCount = 0;
  let errorCount = 0;

  for (let i = 0; i < manifest.length; i++) {
    const item = manifest[i];
    const email = (item.email || '').trim().toLowerCase();
    const phone = cleanPhone(item.contact);
    const name = item.name.trim();
    const pdfPath = item.desktopPath;
    const isFull = item.paymentType.includes('29,899');

    // 1. Validation check
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      console.log(`[${i + 1}/${manifest.length}] ⚠️ Skipped: Invalid email format for "${name}" (${email})`);
      skippedInvalidCount++;
      continue;
    }

    // 2. Exclusion check
    if (EXCLUDED_EMAILS.has(email) || EXCLUDED_PHONES.has(phone)) {
      console.log(`[${i + 1}/${manifest.length}] 🚫 EXCLUDED as requested: ${name} (${email} / ${item.contact})`);
      excludedCount++;
      continue;
    }

    // 3. File check
    if (!fs.existsSync(pdfPath)) {
      console.log(`[${i + 1}/${manifest.length}] ⚠️ Skipped: PDF file not found at ${pdfPath}`);
      skippedInvalidCount++;
      continue;
    }

    // 4. Duplicate sent check
    if (sentLog[email] && sentLog[email].status === 'SENT') {
      console.log(`[${i + 1}/${manifest.length}] ⏩ Already sent to ${name} (${email}) - skipping`);
      alreadySentCount++;
      continue;
    }

    const htmlBody = getEmailHTML(name, isFull);

    const mailOptions = {
      from: `"${SENDER_NAME}" <${SENDER_EMAIL}>`,
      to: email,
      subject: SUBJECT,
      html: htmlBody,
      attachments: [
        {
          filename: item.fileName,
          path: pdfPath
        }
      ]
    };

    if (isDryRun) {
      console.log(`[DRY RUN] [${i + 1}/${manifest.length}] Ready to send: ${name} <${email}> | File: ${item.fileName} | Link: ${isFull ? 'FULL (₹29,899)' : 'HALF (₹15,000)'}`);
      successCount++;
      continue;
    }

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`[${i + 1}/${manifest.length}] ✅ Sent to ${name} (${email}) - MessageId: ${info.messageId}`);
      sentLog[email] = {
        name,
        email,
        contact: item.contact,
        fileName: item.fileName,
        paymentType: item.paymentType,
        status: 'SENT',
        sentAt: new Date().toISOString(),
        messageId: info.messageId
      };
      fs.writeFileSync(logPath, JSON.stringify(sentLog, null, 2), 'utf8');
      successCount++;
      
      // Delay between emails to respect SMTP limits
      await sleep(1200);
    } catch (err) {
      console.error(`[${i + 1}/${manifest.length}] ❌ Failed for ${name} (${email}):`, err.message);
      sentLog[email] = {
        name,
        email,
        contact: item.contact,
        fileName: item.fileName,
        status: 'ERROR',
        error: err.message,
        timestamp: new Date().toISOString()
      };
      fs.writeFileSync(logPath, JSON.stringify(sentLog, null, 2), 'utf8');
      errorCount++;
    }
  }

  console.log(`\n================ FINAL SUMMARY ================`);
  console.log(`Total records processed: ${manifest.length}`);
  console.log(`Successfully sent: ${successCount}`);
  console.log(`Excluded contacts: ${excludedCount}`);
  console.log(`Already sent (skipped): ${alreadySentCount}`);
  console.log(`Invalid emails/files: ${skippedInvalidCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log(`Live Log saved to: ${logPath}`);
}

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');

sendAll(isDryRun).catch(console.error);
