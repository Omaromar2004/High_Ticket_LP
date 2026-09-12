import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { ZEPTO_CONFIG, getAgreementHTML, getWelcomeEmailHTML } from '@/lib/agreement-email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, city, plan, paymentId } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone ? phone.trim() : '';
    const cleanCity = city ? city.trim() : '';
    const isFull = plan === 'full';
    const amountStr = isFull ? '29,899' : '15,000';

    const agreementDate = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    // 1. Setup ZeptoMail Transporter
    const transporter = nodemailer.createTransport(ZEPTO_CONFIG);

    // 2. Client Welcome Email
    const clientMailOptions = {
      from: ZEPTO_CONFIG.from,
      to: cleanEmail,
      subject: `FIQRTAALIM 1-1 Mentorship & Service Program — ${cleanName}`,
      html: getWelcomeEmailHTML(cleanName, amountStr, isFull),
    };

    const clientInfo = await transporter.sendMail(clientMailOptions);
    console.log(`[Email Sent] ✅ Sent to ${cleanName} <${cleanEmail}> (MessageId: ${clientInfo.messageId})`);

    // 3. Admin Notification to team@fiqr.in
    const adminMailOptions = {
      from: ZEPTO_CONFIG.from,
      to: 'team@fiqr.in',
      subject: `[NEW LEAD] ${cleanName} filled Partnership Form (${plan?.toUpperCase() || 'INSTALLMENT'} - ₹${amountStr})`,
      html: `
        <div style="font-family: sans-serif; max-width: 550px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h3 style="color: #0f172a; margin-top: 0;">New Lead Captured on FIQRTAALIM Form</h3>
          <p><strong>Name:</strong> ${cleanName}</p>
          <p><strong>Email:</strong> <a href="mailto:${cleanEmail}">${cleanEmail}</a></p>
          <p><strong>Phone:</strong> <a href="https://wa.me/91${cleanPhone}">+91 ${cleanPhone} (WhatsApp)</a></p>
          <p><strong>Delivery City:</strong> ${cleanCity}</p>
          <p><strong>Selected Plan:</strong> ${plan} (₹${amountStr})</p>
          <p><strong>Date:</strong> ${agreementDate}</p>
        </div>
      `,
    };

    await transporter.sendMail(adminMailOptions).catch(err => console.error('Admin alert error:', err));

    return NextResponse.json({
      success: true,
      messageId: clientInfo.messageId,
    });
  } catch (error: any) {
    console.error('[Agreement Error] ❌ Failed to process lead:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send agreement email' },
      { status: 500 }
    );
  }
}

