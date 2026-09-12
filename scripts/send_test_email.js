const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const SENDER_EMAIL = 'assistance.fiqrtaalim@gmail.com';
const SENDER_NAME = 'Fiqrtaalim';
const SENDER_PASS = 'uovb axfr hieh vahz'.replace(/\s+/g, '');
const SUBJECT = "TEST: Onboarding Confirmation – Let’s Begin Building Your Online Store";

const LINK_HALF = 'https://rzp.io/rzp/db1qFEB8';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: SENDER_EMAIL,
    pass: SENDER_PASS
  }
});

function getEmailHTML(name) {
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
<strong>first installment payment of ₹15,000/-</strong> using the secure payment option below:
</p>

<!-- Payment Button -->
<div style="text-align:center; margin:28px 0;">
<a href="${LINK_HALF}"
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
<a href="${LINK_HALF}" target="_blank" style="color:#2563eb; word-break: break-all;">
${LINK_HALF}
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

<p>
The remaining balance of <strong>₹14,899/-</strong> will be payable as agreed.
</p>

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

async function sendTest() {
  const samplePdf = 'C:\\Users\\Mohammed Aqib\\Desktop\\Agreements_FiqrTaalim\\Agreement - MOhammed omar.pdf';
  
  const testRecipients = ['assistance.fiqrtaalim@gmail.com'];
  
  for (const testEmail of testRecipients) {
    const mailOptions = {
      from: `"${SENDER_NAME}" <${SENDER_EMAIL}>`,
      to: testEmail,
      subject: SUBJECT,
      html: getEmailHTML('Mohammed Omar'),
      attachments: [
        {
          filename: 'Agreement - Mohammed Omar.pdf',
          path: samplePdf
        }
      ]
    };

    console.log(`Sending sample test email to ${testEmail}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`Sample test email sent successfully! MessageId: ${info.messageId}`);
  }
}

sendTest().catch(console.error);
