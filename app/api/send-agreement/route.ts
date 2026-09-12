import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import puppeteer from 'puppeteer-core';
import fs from 'fs';
import { ZEPTO_CONFIG, getAgreementHTML, getWelcomeEmailHTML } from '@/lib/agreement-email';

function getExecutablePath() {
  const edgePath64 = 'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe';
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

  if (fs.existsSync(edgePath64)) return edgePath64;
  if (fs.existsSync(edgePath)) return edgePath;
  if (fs.existsSync(chromePath)) return chromePath;
  throw new Error('No browser executable found on system');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, city, plan, paymentId } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const isFull = plan === 'full';
    const amountStr = isFull ? '29,899' : '15,000';

    const agreementDate = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    // 1. Generate PDF Agreement via Puppeteer
    let pdfBuffer: Buffer;
    const browserPath = getExecutablePath();
    const browser = await puppeteer.launch({
      executablePath: browserPath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-extensions']
    });

    const page = await browser.newPage();
    const agreementHTML = getAgreementHTML(cleanName, agreementDate, isFull);
    await page.setContent(agreementHTML, { waitUntil: 'domcontentloaded' });
    pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0px', bottom: '0px', left: '0px', right: '0px' }
    });
    await browser.close();

    // 2. Setup ZeptoMail Transporter
    const transporter = nodemailer.createTransport(ZEPTO_CONFIG);

    const safeFileName = cleanName.replace(/[^a-zA-Z0-9]/g, '_');
    const pdfFileName = `FIQRTAALIM_Service_Agreement_${safeFileName}.pdf`;

    const mailOptions = {
      from: ZEPTO_CONFIG.from,
      to: cleanEmail,
      subject: `Your FIQRTAALIM Service Agreement & Seat Confirmation — ${cleanName}`,
      html: getWelcomeEmailHTML(cleanName, amountStr, isFull),
      attachments: [
        {
          filename: pdfFileName,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Agreement Sent] ✅ Sent to ${cleanName} <${cleanEmail}> via ZeptoMail (MessageId: ${info.messageId})`);

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      fileName: pdfFileName
    });
  } catch (error: any) {
    console.error('[Agreement Error] ❌ Failed to send agreement:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send agreement email' },
      { status: 500 }
    );
  }
}
