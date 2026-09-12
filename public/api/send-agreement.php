<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

$name = isset($input['name']) ? trim($input['name']) : '';
$email = isset($input['email']) ? trim($input['email']) : '';
$phone = isset($input['phone']) ? trim($input['phone']) : '';
$city = isset($input['city']) ? trim($input['city']) : '';
$plan = isset($input['plan']) ? $input['plan'] : 'installment';
$date = isset($input['date']) ? $input['date'] : date('d F Y');
$ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'Unknown';
$timestamp = date('Y-m-d H:i:s');

if (empty($name) || empty($email)) {
    echo json_encode(['error' => 'Name and Email are required']);
    exit;
}

$isFullPayment = ($plan === 'full');
$amount = $isFullPayment ? '29,899' : '15,000';
$paymentUrl = $isFullPayment ? 'https://rzp.io/rzp/M32rMCs9' : 'https://rzp.io/rzp/db1qFEB8';
$paymentStageText = $isFullPayment ? 'full enrollment' : 'first installment';

// 1. SAVE LEAD DATA TO CSV & JSON (ALL LEADS SAVED IRRESPECTIVE OF PAYMENT)
$dataDir = __DIR__ . '/data';
if (!file_exists($dataDir)) {
    @mkdir($dataDir, 0755, true);
}

// Save to CSV
$csvFile = $dataDir . '/leads.csv';
$isNewFile = !file_exists($csvFile);
$fp = @fopen($csvFile, 'a');
if ($fp) {
    if ($isNewFile) {
        fputcsv($fp, ['Timestamp', 'Name', 'Email', 'Phone', 'City', 'Plan', 'Amount', 'IP']);
    }
    fputcsv($fp, [$timestamp, $name, $email, $phone, $city, $plan, $amount, $ip]);
    fclose($fp);
}

// Save to JSON
$jsonFile = $dataDir . '/leads.json';
$leads = [];
if (file_exists($jsonFile)) {
    $existing = @file_get_contents($jsonFile);
    $leads = json_decode($existing, true) ?: [];
}
$leads[] = [
    'timestamp' => $timestamp,
    'name' => $name,
    'email' => $email,
    'phone' => $phone,
    'city' => $city,
    'plan' => $plan,
    'amount' => $amount,
    'ip' => $ip
];
@file_put_contents($jsonFile, json_encode($leads, JSON_PRETTY_PRINT));

// 2. DISPATCH TO GOOGLE FORM (TRIGGERS LINKED GOOGLE APPS SCRIPT FOR WHATSAPP & EMAIL)
function triggerGoogleForm($name, $email, $phone, $plan) {
    $formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSf93nJwTsFthMCbO4pCtPvvAlrR7LyDYBNgV4I9ih8EC_VNFA/formResponse';
    $amountOption = ($plan === 'full') ? '29,899/- [Full Payment]' : '15,000/-[hafl Payment]';

    $postData = http_build_query([
        'entry.813229620' => $name,
        'entry.199077193' => 'Male',
        'entry.224170834' => $email,
        'entry.1890214637' => $phone,
        'entry.424963998' => '1000/day',
        'entry.873081694' => 'Right Now, Inshallah',
        'entry.1098580725' => $amountOption,
    ]);

    if (function_exists('curl_init')) {
        $ch = curl_init($formUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
        curl_setopt($ch, CURLOPT_TIMEOUT, 6);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        @curl_exec($ch);
        @curl_close($ch);
    } else {
        $opts = [
            'http' => [
                'method' => 'POST',
                'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
                'content' => $postData,
                'timeout' => 6
            ],
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false
            ]
        ];
        $context = stream_context_create($opts);
        @file_get_contents($formUrl, false, $context);
    }
}

// Trigger Google Form in background
@triggerGoogleForm($name, $email, $phone, $plan);

// 3. HTTPS REST API SENDER VIA ZEPTOMAIL (100% RELIABLE ON HOSTINGER)
function sendZeptoMail($toEmail, $toName, $subject, $htmlBody) {
    $token = 'PHtE6r1YRu7r3mAm8BAJtKe6QMKtPI4n+OpufVZOsYpBC6QBTU1d/d4okGSwrRcvB/BCEPHKy4Jo4r+f5erXcT65NmcfXGqyqK3sx/VYSPOZsbq6x00etVsdfk3eUI/scdRq3CDfv9nbNA==';
    $payload = [
        'from' => [
            'address' => 'team@fiqr.in',
            'name' => 'FIQRTAALIM'
        ],
        'to' => [
            [
                'email_address' => [
                    'address' => $toEmail,
                    'name' => $toName
                ]
            ]
        ],
        'subject' => $subject,
        'htmlbody' => $htmlBody
    ];

    $jsonData = json_encode($payload);

    // Try cURL first
    if (function_exists('curl_init')) {
        $ch = curl_init('https://api.zeptomail.in/v1.1/email');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Accept: application/json',
            'Content-Type: application/json',
            'Authorization: Zoho-enczapikey ' . $token
        ]);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
        curl_setopt($ch, CURLOPT_TIMEOUT, 12);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode >= 200 && $httpCode < 300) {
            return true;
        }
    }

    // Fallback to file_get_contents with stream context
    $opts = [
        'http' => [
            'method'  => 'POST',
            'header'  => "Accept: application/json\r\n" .
                         "Content-Type: application/json\r\n" .
                         "Authorization: Zoho-enczapikey " . $token . "\r\n",
            'content' => $jsonData,
            'timeout' => 12
        ],
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false
        ]
    ];
    $context = stream_context_create($opts);
    $result = @file_get_contents('https://api.zeptomail.in/v1.1/email', false, $context);

    return ($result !== false);
}

// 3. BUILD CLIENT EMAIL BODY (EXACT TEMPLATE REQUESTED)
$remainingText = $isFullPayment
    ? ''
    : '<p style="margin: 14px 0; font-size: 14.5px; color: #1e293b;">The remaining balance of <strong>₹14,899/-</strong> will be payable in the second installment as agreed.</p>';

$clientEmailBody = '<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; line-height: 1.6; }
  .container { max-width: 620px; margin: 25px auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; }
  .header { background: #0C0B09; padding: 26px 22px; text-align: center; border-bottom: 2px solid #E6CA85; }
  .header h1 { color: #E6CA85; margin: 0; font-size: 22px; letter-spacing: 2px; font-family: Georgia, serif; }
  .header p { color: #F5EFE6; margin: 5px 0 0 0; font-size: 13px; opacity: 0.9; }
  .content { padding: 30px 26px; font-size: 14.5px; color: #334155; }
  .greeting { font-size: 15.5px; font-weight: 600; color: #0f172a; margin-bottom: 12px; }
  .section-heading { color: #0f172a; font-size: 15.5px; font-weight: 700; margin: 24px 0 10px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
  .btn-pay { display: inline-block; background: #10B981; color: #ffffff !important; text-decoration: none; padding: 13px 28px; border-radius: 8px; font-weight: 700; font-size: 14.5px; letter-spacing: 0.5px; margin: 12px 0 8px 0; }
  .bank-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px 18px; margin: 12px 0; }
  .bank-row { margin-bottom: 5px; font-size: 13.5px; }
  .bank-label { color: #64748b; font-weight: 500; display: inline-block; width: 140px; }
  .bank-value { color: #0f172a; font-weight: 600; font-family: monospace, sans-serif; }
  .footer { background: #f1f5f9; padding: 16px 22px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>FIQRTAALIM</h1>
    <p>1-1 Mentorship &amp; Service Program</p>
  </div>

  <div class="content">
    <p class="greeting">Dear ' . htmlspecialchars($name) . ',</p>
    <p><strong>Assalamu Alaikum,</strong></p>
    <p>We are excited to officially welcome you to Fiqrtaalim’s 1-1 Mentorship &amp; Service Program.</p>
    
    <p>Please find your Service Agreement details for your reference. This agreement outlines the complete scope of services, mentorship process, inventory details, refund policy, and our commitment to support you until initiation of sales is achieved, InshaAllah.</p>

    <div class="section-heading">Payment &amp; Onboarding</div>
    <p>To initiate your onboarding, kindly proceed with the ' . $paymentStageText . ' payment of <strong>₹' . $amount . '/-</strong> using the secure payment option below:</p>
    
    <div style="text-align: center; margin: 18px 0;">
      <a href="' . $paymentUrl . '" class="btn-pay">Make Secure Payment</a>
      <p style="font-size: 12px; color: #64748b; margin-top: 6px;">
        If the button does not work, use this link:<br>
        <a href="' . $paymentUrl . '" style="color: #0284c7; word-break: break-all;">' . $paymentUrl . '</a>
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

    ' . $remainingText . '

    <p>Once the ' . $paymentStageText . ' payment is completed, our team will immediately initiate the setup process, including Shopify website development, business account setups, inventory dispatch, and mentorship scheduling.</p>

    <p>If you have any queries before making the payment, feel free to reply to this email.</p>

    <p>We look forward to building your brand together and helping you achieve your goals successfully, InshaAllah.</p>

    <p style="margin-top: 24px; margin-bottom: 0;">
      Warm Regards,<br>
      <strong>Team FIQRTAALIM</strong>
    </p>
  </div>

  <div class="footer">
    © ' . date('Y') . ' FIQRTAALIM · 100% Halal E-Commerce Partnership
  </div>
</div>
</body>
</html>';

$clientSubject = "FIQRTAALIM 1-1 Mentorship & Service Program — " . $name;
$clientSent = sendZeptoMail($email, $name, $clientSubject, $clientEmailBody);

// 4. SEND ADMIN LEAD NOTIFICATION TO team@fiqr.in
$adminSubject = "[NEW LEAD] " . $name . " filled Partnership Form (" . strtoupper($plan) . " - ₹" . $amount . ")";
$adminBody = "<div style='font-family:sans-serif; max-width:550px; padding:20px; border:1px solid #e2e8f0; border-radius:10px;'>"
           . "<h3 style='color:#0f172a; margin-top:0;'>New Lead Captured on FIQRTAALIM Form</h3>"
           . "<p><strong>Name:</strong> " . htmlspecialchars($name) . "</p>"
           . "<p><strong>Email:</strong> <a href='mailto:" . htmlspecialchars($email) . "'>" . htmlspecialchars($email) . "</a></p>"
           . "<p><strong>Phone:</strong> <a href='https://wa.me/91" . htmlspecialchars($phone) . "'>+91 " . htmlspecialchars($phone) . " (WhatsApp)</a></p>"
           . "<p><strong>Delivery City:</strong> " . htmlspecialchars($city) . "</p>"
           . "<p><strong>Selected Plan:</strong> " . htmlspecialchars($plan) . " (₹" . $amount . ")</p>"
           . "<p><strong>Timestamp:</strong> " . $timestamp . "</p>"
           . "<p><strong>IP:</strong> " . $ip . "</p>"
           . "</div>";

sendZeptoMail('team@fiqr.in', 'FIQRTAALIM Admin', $adminSubject, $adminBody);

echo json_encode([
    'success' => true,
    'message' => 'Lead captured and agreement email dispatched to ' . $email
]);

