const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

function getExecutablePath() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const edgePath64 = 'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  
  if (fs.existsSync(edgePath64)) return edgePath64;
  if (fs.existsSync(edgePath)) return edgePath;
  if (fs.existsSync(chromePath)) return chromePath;
  throw new Error('No browser executable found');
}

function generateAgreementHTML(clientName, agreementDate, paymentClause) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @page {
    size: A4;
    margin: 0;
  }
  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
  }
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #111827;
    font-size: 13.5px;
    line-height: 1.55;
    background: #fff;
  }
  .page {
    width: 210mm;
    min-height: 297mm;
    padding: 22mm 24mm 20mm 24mm;
    position: relative;
    page-break-after: always;
    display: flex;
    flex-direction: column;
  }
  .page:last-child {
    page-break-after: avoid;
  }
  h1.doc-title {
    text-align: center;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 0.5px;
    margin-top: 15px;
    margin-bottom: 26px;
    text-transform: uppercase;
    color: #0f172a;
  }
  h2.section-title {
    font-size: 14.5px;
    font-weight: 700;
    margin-top: 18px;
    margin-bottom: 8px;
    color: #0f172a;
  }
  p {
    margin: 0 0 10px 0;
  }
  .intro-block {
    margin-bottom: 18px;
  }
  .party-line {
    margin: 3px 0;
  }
  ul {
    margin: 6px 0 12px 0;
    padding-left: 22px;
  }
  li {
    margin-bottom: 4px;
  }
  ul.sub-list {
    list-style-type: circle;
    margin-top: 4px;
    margin-bottom: 4px;
    padding-left: 20px;
  }
  ul.sub-list li {
    margin-bottom: 3px;
  }
  .payment-clause {
    margin: 8px 0 14px 0;
    line-height: 1.6;
    text-align: justify;
  }
  .ack-title {
    font-weight: 700;
    margin-top: 20px;
    margin-bottom: 8px;
    font-size: 14px;
  }
  .sign-section {
    margin-top: 30px;
  }
  .company-info {
    margin-bottom: 12px;
    line-height: 1.4;
  }
  .signature-box {
    margin: 15px 0 10px 0;
  }
  .sign-img {
    height: 60px;
    width: auto;
    display: block;
  }
  .signer-name {
    font-weight: 700;
    text-transform: uppercase;
    font-size: 13px;
    margin-top: 8px;
    margin-bottom: 2px;
  }
  .signer-title {
    font-size: 12.5px;
    color: #374151;
  }
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
      <li>Designing and building a Shopify website.</li>
      <li>Setting up Instagram & Facebook business accounts.</li>
      <li>Creating and configuring Meta Ad Manager with tracking pixels.</li>
      <li>Setting up WhatsApp Business account & sales funnel.</li>
      <li>Consultation for pricing strategy.</li>
      <li>Consultation & guidance for legal documents (KYC for Razorpay & Shiprocket).</li>
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

    <h2 class="section-title">2. Fees & Payment Terms</h2>
    <div class="payment-clause">
      ${paymentClause}
    </div>

    <h2 class="section-title">3. Service Guarantee</h2>
    <ul>
      <li>The Service Provider guarantees to mentor and assist the Client until the Client achieves confirmed sales through their online store.</li>
      <li>Upon initiation of sales, the Service Provider’s obligation under this Agreement shall be deemed fulfilled, and the Service Provider shall exit the project.</li>
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
      <li>Bear all costs related to advertising & shipping.</li>
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

    <div class="ack-title">Acknowledgment & Acceptance</div>
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
          <!-- Stylized CEO Signature matching template -->
          <path d="M 25 55 Q 35 15, 45 45 Q 52 10, 58 52 Q 65 30, 75 48 Q 85 20, 95 50 Q 115 45, 135 52" fill="none" stroke="#1e293b" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M 38 62 C 55 60, 85 58, 115 62" fill="none" stroke="#1e293b" stroke-width="1.8" stroke-linecap="round"/>
          <circle cx="122" cy="62" r="1.8" fill="#1e293b" />
        </svg>
      </div>

      <div class="signer-name">MOHAMMED OMAR</div>
      <div class="signer-title">Co founder & CEO, Fiqrtaalim</div>
    </div>
  </div>

</body>
</html>`;
}

module.exports = { generateAgreementHTML, getExecutablePath };
