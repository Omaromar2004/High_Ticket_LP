import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// ZeptoMail SMTP Configuration
export const ZEPTO_CONFIG = {
  host: 'smtp.zeptomail.in',
  port: 465,
  secure: true,
  auth: {
    user: 'emailapikey',
    pass: 'PHtE6r1YRu7r3mAm8BAJtKe6QMKtPI4n+OpufVZOsYpBC6QBTU1d/d4okGSwrRcvB/BCEPHKy4Jo4r+f5erXcT65NmcfXGqyqK3sx/VYSPOZsbq6x00etVsdfk3eUI/scdRq3CDfv9nbNA=='
  },
  from: '"FIQRTAALIM" <team@fiqr.in>'
};

export function getAgreementHTML(clientName: string, agreementDate: string, isFullPayment: boolean) {
  const paymentClause = isFullPayment
    ? `The Client agrees to pay a one-time service fee of ₹29,899/- (Twenty-Nine Thousand Eight Hundred Ninety-Nine Only). This fee includes the above-mentioned product inventory. Advertising budget is not included and shall be borne solely by the Client. Payment has been made in full in advance before commencement of services.`
    : `The Client agrees to pay a one-time service fee of ₹29,899/- (Twenty-Nine Thousand Eight Hundred Ninety-Nine Only). This fee includes the above-mentioned product inventory. Advertising budget is not included and shall be borne solely by the Client. The payment shall be made in the following schedule: Initial Payment: ₹15,000/- (Fifteen Thousand Only) has been paid upon signing this Agreement, in order to confirm the Client’s seat and dispatch the opening inventory kit. Remaining Balance: ₹14,899/- (Fourteen Thousand Eight Hundred Ninety-Nine Only) to be paid by the Client before live ad campaign launch. Services shall commence upon confirmation of initial payment.`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; }
  body {
    margin: 0; padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #111827; font-size: 13.5px; line-height: 1.55; background: #fff;
  }
  .page {
    width: 210mm; min-height: 297mm; padding: 22mm 24mm 20mm 24mm;
    position: relative; page-break-after: always; display: flex; flex-direction: column;
  }
  .page:last-child { page-break-after: avoid; }
  h1.doc-title {
    text-align: center; font-size: 20px; font-weight: 700; letter-spacing: 0.5px;
    margin-top: 15px; margin-bottom: 26px; text-transform: uppercase; color: #0f172a;
  }
  h2.section-title {
    font-size: 14.5px; font-weight: 700; margin-top: 18px; margin-bottom: 8px; color: #0f172a;
  }
  p { margin: 0 0 10px 0; }
  .intro-block { margin-bottom: 18px; }
  .party-line { margin: 3px 0; }
  ul { margin: 6px 0 12px 0; padding-left: 22px; }
  li { margin-bottom: 4px; }
  ul.sub-list { list-style-type: circle; margin-top: 4px; margin-bottom: 4px; padding-left: 20px; }
  ul.sub-list li { margin-bottom: 3px; }
  .payment-clause { margin: 8px 0 14px 0; line-height: 1.6; text-align: justify; }
  .ack-title { font-weight: 700; margin-top: 20px; margin-bottom: 8px; font-size: 14px; }
  .sign-section { margin-top: 30px; }
  .company-info { margin-bottom: 12px; line-height: 1.4; }
  .signature-box { margin: 15px 0 10px 0; }
  .sign-img { height: 60px; width: auto; display: block; }
  .signer-name { font-weight: 700; text-transform: uppercase; font-size: 13px; margin-top: 8px; margin-bottom: 2px; }
  .signer-title { font-size: 12.5px; color: #374151; }
</style>
</head>
<body>
  <!-- PAGE 1 -->
  <div class="page">
    <h1 class="doc-title">FIQRTAALIM SERVICE AGREEMENT</h1>
    
    <div class="intro-block">
      <p>This Service Agreement (“Agreement”) is made and entered into on this <strong>${agreementDate}</strong>, by and between:</p>
      <p class="party-line"><strong>Company Name:</strong> FIQRTAALIM (Hereinafter referred to as “Service Provider”)</p>
      <p class="party-line"><strong>Client Name:</strong> <strong>${clientName}</strong> (Hereinafter referred to as “Client”)</p>
      <p class="party-line">Together referred to as the “Parties.”</p>
    </div>

    <h2 class="section-title">1. Scope of Services</h2>
    <p>The Service Provider agrees to provide the following services to the Client under this Agreement:</p>
    <ul>
      <li>Designing and building a custom Shopify website.</li>
      <li>Setting up Instagram &amp; Facebook business accounts.</li>
      <li>Creating and configuring Meta Ad Manager with tracking pixels.</li>
      <li>Setting up WhatsApp Business account &amp; sales funnel.</li>
      <li>Consultation for pricing strategy &amp; profit margins.</li>
      <li>Consultation &amp; guidance for legal documents (KYC for Razorpay &amp; Shiprocket).</li>
      <li>Complete setup of Razorpay payment gateway and Shiprocket logistics account.</li>
      <li>Connecting Instagram, WhatsApp Business, and Meta Business Manager.</li>
      <li>Running initial advertising campaigns (ad budget borne by Client).</li>
      <li>Providing 1-to-1 mentorship until Client achieves confirmed sales.</li>
      <li>Supplying physical product inventory, consisting of:
        <ul class="sub-list">
          <li>25 units of Tayammum Kits (Complete boxed set)</li>
          <li>25 sets of Traceable Islamic Kids Activity Books</li>
          <li>10 sets of Hindi Dua Stickers + 10 sets of English Dua Stickers</li>
          <li>With Branded packaging material and cargo charges included.</li>
        </ul>
      </li>
    </ul>

    <h2 class="section-title">2. Fees &amp; Payment Terms</h2>
    <div class="payment-clause">
      ${paymentClause}
    </div>

    <h2 class="section-title">3. Service Guarantee</h2>
    <ul>
      <li>The Service Provider guarantees to mentor and assist the Client until the Client achieves confirmed sales through their online store.</li>
      <li>Upon initiation of sales, the Service Provider’s initial fulfillment obligation shall be deemed active, and the Client graduates into our community scale group.</li>
    </ul>
  </div>

  <!-- PAGE 2 -->
  <div class="page">
    <h2 class="section-title" style="margin-top: 10px;">4. Refund Policy</h2>
    <ul>
      <li>If the Service Provider fails to help the Client achieve sales, the Client shall be entitled to an 80% refund of the service fee.</li>
      <li>The refund is strictly subject to the following conditions:
        <ul class="sub-list">
          <li>The Client must follow all strategies, mentorship guidelines, and instructions provided.</li>
          <li>The Client must allocate and spend the minimum agreed ad budget as instructed.</li>
          <li>The Client must not make unauthorized changes to the website, ads, pricing, or setup.</li>
          <li>The Client must provide all necessary documents, approvals, and access credentials on time.</li>
        </ul>
      </li>
      <li>If the Client fails to comply with the above conditions, the refund clause shall be considered null and void.</li>
    </ul>

    <h2 class="section-title">5. Client Responsibilities</h2>
    <p>The Client agrees to:</p>
    <ul>
      <li>Provide accurate business details, documents, and KYC information on time.</li>
      <li>Bear all costs related to advertising &amp; shipping.</li>
      <li>Not misuse, resell, or duplicate the mentorship services provided under this Agreement.</li>
      <li>Maintain transparency and active communication with their assigned Account Manager.</li>
    </ul>

    <h2 class="section-title">6. Limitation of Liability</h2>
    <ul>
      <li>The Service Provider shall not be held liable for delays or failures caused by third-party platforms (Shopify, Razorpay, Shiprocket, Meta, etc.).</li>
      <li>The Service Provider shall not be responsible for courier transit delays once the provided inventory is dispatched.</li>
    </ul>

    <h2 class="section-title">7. Termination</h2>
    <p>This Agreement may be terminated by either Party by mutual written consent or upon breach of obligations.</p>
  </div>

  <!-- PAGE 3 -->
  <div class="page">
    <h2 class="section-title" style="margin-top: 10px;">8. Dispute Resolution</h2>
    <ul>
      <li>Any disputes arising under this Agreement shall first be resolved through mutual discussion.</li>
      <li>If unresolved, the matter shall fall under the jurisdiction of the courts in Mysore, Karnataka, India.</li>
    </ul>

    <p style="margin-top: 18px; margin-bottom: 22px;">
      This Agreement constitutes the entire understanding between the Parties and supersedes all prior discussions.
    </p>

    <div class="ack-title">Acknowledgment &amp; Acceptance</div>
    <p style="text-align: justify; line-height: 1.6;">
      By making a successful payment of the service fee, the Client acknowledges that they have read, understood, and agreed to the terms and conditions outlined in this Agreement. The payment shall be deemed as full acceptance of this Agreement.
    </p>

    <div class="sign-section">
      <div class="company-info">
        <strong>FIQRTAALIM</strong><br>
        Mysuru, Karnataka, India.
      </div>

      <div class="signature-box">
        <svg class="sign-img" viewBox="0 0 160 80" xmlns="http://www.w3.org/2000/svg">
          <path d="M 25 55 Q 35 15, 45 45 Q 52 10, 58 52 Q 65 30, 75 48 Q 85 20, 95 50 Q 115 45, 135 52" fill="none" stroke="#1e293b" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M 38 62 C 55 60, 85 58, 115 62" fill="none" stroke="#1e293b" stroke-width="1.8" stroke-linecap="round"/>
          <circle cx="122" cy="62" r="1.8" fill="#1e293b" />
        </svg>
      </div>

      <div class="signer-name">MOHAMMED OMAR</div>
      <div class="signer-title">Co-Founder &amp; CEO, Fiqrtaalim</div>
    </div>
  </div>
</body>
</html>`;
}

export function getWelcomeEmailHTML(clientName: string, paymentAmount: string, isFullPayment: boolean) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 15px;">
<tr>
<td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 10px 25px rgba(0,0,0,0.06); max-width:600px; width:100%; border:1px solid #e2e8f0;">

  <!-- Header -->
  <tr>
    <td style="background:#0c0b09; padding:32px 24px; text-align:center;">
      <h1 style="color:#e6ca85; margin:0; font-size:24px; letter-spacing:2px; font-family: Georgia, serif;">FIQRTAALIM</h1>
      <p style="color:#f5efe6; opacity:0.8; margin:6px 0 0 0; font-size:13px; letter-spacing:1px; text-transform:uppercase;">Partnership Programme · Official Confirmation</p>
    </td>
  </tr>

  <!-- Body -->
  <tr>
    <td style="padding:36px 32px; color:#334155; font-size:15px; line-height:1.7;">
      <p style="margin-top:0; font-size:16px;">Assalamu Alaikum <strong>${clientName}</strong>,</p>

      <p>
        Alhamdulillah! We have successfully received your payment of <strong>₹${paymentAmount}/-</strong> and your seat in the <strong>Fiqrtaalim Partnership Programme</strong> is officially confirmed.
      </p>

      <div style="background:#faf8f5; border-left:4px solid #e6ca85; padding:16px 20px; margin:24px 0; border-radius:4px;">
        <h4 style="margin:0 0 8px 0; color:#0f172a; font-size:15px;">📄 Your Official Service Agreement Attached</h4>
        <p style="margin:0; font-size:13.5px; color:#475569;">
          Please find attached your personalized <strong>FIQRTAALIM Service Agreement PDF</strong> signed by our CEO Mohammed Omar for your records.
        </p>
      </div>

      <h3 style="color:#0f172a; font-size:16px; margin:24px 0 12px 0;">Next Immediate Steps:</h3>
      <ul style="padding-left:20px; margin:0 0 24px 0; font-size:14px; color:#475569;">
        <li style="margin-bottom:8px;"><strong>Opening Stock Dispatch:</strong> Your ₹25,000 physical inventory (Tayammum sets, Activity Books, Dua Stickers & Packaging) is being prepared for dispatch via Shiprocket.</li>
        <li style="margin-bottom:8px;"><strong>1:1 Account Manager Assigned:</strong> Your dedicated manager will reach out to you directly on WhatsApp within 24 hours to schedule your onboarding call.</li>
        <li style="margin-bottom:8px;"><strong>Store Setup Initiation:</strong> We will begin configuring your Shopify store, savings account payment gateway, and Meta Pixel.</li>
      </ul>

      <div style="text-align:center; margin:32px 0 24px 0;">
        <a href="https://wa.me/919999999999?text=Assalamu%20Alaikum%20Fiqrtaalim%20Team,%20I%20have%20confirmed%20my%20seat%20for%20${encodeURIComponent(clientName)}.%20Please%20connect%20my%20account%20manager." 
           style="background:#10b981; color:#ffffff; text-decoration:none; padding:14px 28px; border-radius:8px; font-weight:700; font-size:14px; display:inline-block; letter-spacing:0.5px; box-shadow:0 4px 12px rgba(16,185,129,0.3);">
          Connect With Your Account Manager on WhatsApp →
        </a>
      </div>

      <p style="margin-bottom:0; font-size:14px; color:#64748b;">
        If you have any questions or need immediate assistance, simply reply directly to this email or contact our support team.
      </p>

      <p style="margin-top:28px; margin-bottom:0; font-size:14px;">
        Warm regards,<br>
        <strong>Mohammed Omar &amp; Team FIQRTAALIM</strong><br>
        <span style="color:#94a3b8; font-size:12px;">Mysuru, Karnataka, India</span>
      </p>
    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="background:#f1f5f9; padding:16px 24px; text-align:center; font-size:12px; color:#64748b; border-top:1px solid #e2e8f0;">
      © ${new Date().getFullYear()} FIQRTAALIM · 100% Halal E-Commerce Partnership
    </td>
  </tr>

</table>
</td>
</tr>
</table>
</body>
</html>`;
}
