import nodemailer from 'nodemailer';

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
    ? `The Client agrees to pay a one-time service fee of ₹29,899/- (Twenty-Nine Thousand Eight Hundred Ninety-Nine Only). This fee includes the above-mentioned product inventory. Advertising budget is not included and shall be borne solely by the Client. Payment must be made in full in advance before commencement of services.`
    : `The Client agrees to pay a service fee of ₹29,899/- (Twenty-Nine Thousand Eight Hundred Ninety-Nine Only). This fee includes the above-mentioned product inventory. Advertising budget is not included and shall be borne solely by the Client. The payment shall be made in two installments:<br>
    <strong>• Initial Payment:</strong> ₹15,000/- (Fifteen Thousand Only) has been paid upon signing this Agreement, in order to confirm the Client’s seat and dispatch the opening inventory kit.<br>
    <strong>• Remaining Balance:</strong> ₹14,899/- (Fourteen Thousand Eight Hundred Ninety-Nine Only) to be paid by the Client before live ad campaign launch. Services shall commence upon confirmation of initial payment.`;

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
  .sign-img { height: 65px; width: auto; display: block; }
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
      <p class="party-line">Together referred to as the “Parties. ”</p>
    </div>

    <h2 class="section-title">1. Scope of Services</h2>
    <p>The Service Provider agrees to provide the following services to the Client under this Agreement:</p>
    <ul>
      <li>Designing and building a Shopify website.</li>
      <li>Setting up Instagram &amp; Facebook business accounts.</li>
      <li>Creating and configuring Meta Ad Manager with tracking pixels.</li>
      <li>Setting up WhatsApp Business account &amp; sales funnel.</li>
      <li>Consultation for pricing strategy.</li>
      <li>Consultation &amp; guidance for legal documents (KYC for Razorpay &amp; Shiprocket).</li>
      <li>Complete setup of Razorpay payment gateway and Shiprocket logistics account.</li>
      <li>Connecting Instagram, WhatsApp Business, and Meta Business Manager.</li>
      <li>Running initial advertising campaigns (ad budget borne by Client).</li>
      <li>Providing 1-to-1 mentorship until Client achieves confirmed sales.</li>
      <li>Supplying product inventory, consisting of:
        <ul class="sub-list">
          <li>40 sets of Traceable Kits</li>
          <li>10 sets of Hindi Dua Stickers</li>
          <li>10 sets of English Dua Stickers</li>
          <li>With Packaging material and cargo charges included in this.</li>
        </ul>
      </li>
    </ul>

    <h2 class="section-title">2. Fees &amp; Payment Terms</h2>
    <div class="payment-clause">
      ${paymentClause}
    </div>
  </div>

  <!-- PAGE 2 -->
  <div class="page">
    <h2 class="section-title" style="margin-top: 10px;">3. Service Guarantee</h2>
    <ul>
      <li>The Service Provider guarantees to mentor and assist the Client until the Client achieves confirmed sales through their online store.</li>
      <li>Upon initiation of sales, the Service Provider’s obligation under this Agreement shall be deemed fulfilled, and the Service Provider shall exit the project.</li>
    </ul>

    <h2 class="section-title">4. Refund Policy</h2>
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
      <li>Maintain transparency in all communications with the Service Provider.</li>
    </ul>

    <h2 class="section-title">6. Limitation of Liability</h2>
    <ul>
      <li>The Service Provider shall not be held liable for delays, losses, or failures caused by third-party platforms (Shopify, Razorpay, Shiprocket, Meta, etc.).</li>
      <li>The Service Provider shall not be responsible for product quality issues, delivery failures, or customer disputes once the provided inventory is handed over to the Client.</li>
    </ul>

    <h2 class="section-title">7. Termination</h2>
    <p>This Agreement may be terminated by either Party under the following conditions:</p>
    <ul>
      <li>By mutual written consent of both Parties.</li>
      <li>In case of breach of obligations by either Party.</li>
    </ul>
    <p>If termination occurs due to the Client’s non-compliance, no refund shall be issued.</p>
  </div>

  <!-- PAGE 3 -->
  <div class="page">
    <h2 class="section-title" style="margin-top: 10px;">8. Dispute Resolution</h2>
    <ul>
      <li>Any disputes arising under this Agreement shall first be resolved through mutual discussion.</li>
      <li>If unresolved, the matter shall fall under the jurisdiction of the courts in Mysore, Karnataka, India.</li>
    </ul>

    <p style="margin-top: 18px; margin-bottom: 22px;">
      This Agreement constitutes the entire understanding between the Parties and supersedes all prior discussions or proposals.
    </p>

    <div class="ack-title">Acknowledgment &amp; Acceptance</div>
    <p style="text-align: justify; line-height: 1.6;">
      By making a successful payment of the service fee, the Client acknowledges that they have read, understood, and agreed to the terms and conditions outlined in this Agreement. The payment shall be deemed as full acceptance of this Agreement. All fees paid are strictly non-refundable under any circumstances except those mentioned under section 4. (Refund Policy), and the Client acknowledges that no refund, reversal, or cancellation request will be entertained once the payment is successfully processed. Agreement, and services shall commence thereafter.
    </p>

    <div class="sign-section">
      <div class="company-info">
        <strong>FIQRTAALIM</strong><br>
        Mysuru, Karnataka.
      </div>

      <div class="signature-box">
        <svg class="sign-img" viewBox="0 0 160 80" xmlns="http://www.w3.org/2000/svg">
          <path d="M 28 58 Q 38 12, 48 42 Q 54 8, 60 52 Q 68 28, 78 46 Q 88 18, 98 48 Q 118 42, 138 50" fill="none" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M 38 64 C 60 62, 90 60, 125 64" fill="none" stroke="#0f172a" stroke-width="1.8" stroke-linecap="round"/>
          <circle cx="130" cy="64" r="2" fill="#0f172a" />
        </svg>
      </div>

      <div class="signer-name">MOHAMMED OMAR</div>
      <div class="signer-title">Co founder &amp; CEO, Fiqrtaalim</div>
    </div>
  </div>
</body>
</html>`;
}

export function getWelcomeEmailHTML(clientName: string, paymentAmount: string, isFullPayment: boolean) {
  const paymentUrl = isFullPayment
    ? 'https://rzp.io/rzp/M32rMCs9'
    : 'https://rzp.io/rzp/db1qFEB8';

  const paymentStageText = isFullPayment ? 'full enrollment' : 'first installment';
  const remainingText = isFullPayment
    ? ''
    : `<p style="margin: 16px 0; font-size: 14.5px; color: #1e293b;">The remaining balance of <strong>₹14,899/-</strong> will be payable in the second installment as agreed.</p>`;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; line-height: 1.6; }
  .container { max-width: 620px; margin: 30px auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
  .header { background: #0C0B09; padding: 28px 24px; text-align: center; border-bottom: 2px solid #E6CA85; }
  .header h1 { color: #E6CA85; margin: 0; font-size: 22px; letter-spacing: 2px; font-family: Georgia, serif; }
  .header p { color: #F5EFE6; margin: 6px 0 0 0; font-size: 13px; opacity: 0.9; letter-spacing: 0.5px; }
  .content { padding: 32px 28px; font-size: 14.5px; color: #334155; }
  .greeting { font-size: 16px; font-weight: 600; color: #0f172a; margin-bottom: 12px; }
  .section-heading { color: #0f172a; font-size: 16px; font-weight: 700; margin: 26px 0 10px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
  .btn-pay { display: inline-block; background: #10B981; color: #ffffff !important; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: 700; font-size: 15px; letter-spacing: 0.5px; margin: 14px 0 10px 0; box-shadow: 0 4px 12px rgba(16,185,129,0.3); }
  .bank-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 18px 20px; margin: 14px 0; }
  .bank-row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13.5px; }
  .bank-label { color: #64748b; font-weight: 500; }
  .bank-value { color: #0f172a; font-weight: 600; font-family: monospace, sans-serif; }
  .footer { background: #f1f5f9; padding: 18px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>FIQRTAALIM</h1>
    <p>1-1 Mentorship &amp; Service Program</p>
  </div>

  <div class="content">
    <p class="greeting">Dear ${clientName},</p>
    <p><strong>Assalamu Alaikum,</strong></p>
    <p>We are excited to officially welcome you to Fiqrtaalim’s 1-1 Mentorship &amp; Service Program.</p>
    
    <p>Please find attached your Service Agreement in PDF format for your reference. This agreement outlines the complete scope of services, mentorship process, inventory details, refund policy, and our commitment to support you until initiation of sales is achieved, InshaAllah.</p>

    <div class="section-heading">Payment &amp; Onboarding</div>
    <p>To initiate your onboarding, kindly proceed with the ${paymentStageText} payment of <strong>₹${paymentAmount}/-</strong> using the secure payment option below:</p>
    
    <div style="text-align: center; margin: 20px 0;">
      <a href="${paymentUrl}" class="btn-pay">Make Secure Payment</a>
      <p style="font-size: 12.5px; color: #64748b; margin-top: 8px;">
        If the button does not work, use this link:<br>
        <a href="${paymentUrl}" style="color: #0284c7; word-break: break-all;">${paymentUrl}</a>
      </p>
    </div>

    <div class="section-heading">Alternative Payment Options</div>
    <div class="bank-box">
      <div class="bank-row"><span class="bank-label">Account Holder:</span> <span class="bank-value">FIQR</span></div>
      <div class="bank-row"><span class="bank-label">Account Number:</span> <span class="bank-value">50200103923234</span></div>
      <div class="bank-row"><span class="bank-label">IFSC:</span> <span class="bank-value">HDFC0002568</span></div>
      <div class="bank-row"><span class="bank-label">Branch:</span> <span class="bank-value">K R Mohalla – Mysore</span></div>
      <div class="bank-row"><span class="bank-label">Account Type:</span> <span class="bank-value">Current Account</span></div>
      <div class="bank-row"><span class="bank-label">MMID:</span> <span class="bank-value">9240276</span></div>
      <div class="bank-row"><span class="bank-label">UPI ID:</span> <span class="bank-value">7829208722-3@ybl</span></div>
      <div class="bank-row"><span class="bank-label">UPI Number:</span> <span class="bank-value">7829208722</span></div>
    </div>

    ${remainingText}

    <p>Once the ${paymentStageText} payment is completed, our team will immediately initiate the setup process, including Shopify website development, business account setups, inventory dispatch, and mentorship scheduling.</p>

    <p>If you have any queries before making the payment, feel free to reply to this email.</p>

    <p>We look forward to building your brand together and helping you achieve your goals successfully, InshaAllah.</p>

    <p style="margin-top: 28px; margin-bottom: 0;">
      Warm Regards,<br>
      <strong>Team FIQRTAALIM</strong>
    </p>
  </div>

  <div class="footer">
    © ${new Date().getFullYear()} FIQRTAALIM · 100% Halal E-Commerce Partnership
  </div>
</div>
</body>
</html>`;
}
