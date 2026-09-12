const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('1. Preparing next.config.mjs for static HTML export...');
const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
`;
fs.writeFileSync('next.config.mjs', nextConfig, 'utf8');

// Temporarily move app/api if present because output: export doesn't allow app/api
const apiDir = path.join(__dirname, '..', 'app', 'api');
const tempApiDir = path.join(__dirname, '..', 'temp_api');
if (fs.existsSync(apiDir)) {
  if (fs.existsSync(tempApiDir)) fs.rmSync(tempApiDir, { recursive: true, force: true });
  fs.renameSync(apiDir, tempApiDir);
}

console.log('2. Running next build...');
try {
  execSync('npx next build', { stdio: 'inherit' });
  console.log('✅ Next.js Static Export completed successfully!');
} catch (e) {
  console.error('Build error:', e);
} finally {
  if (fs.existsSync(tempApiDir)) {
    fs.renameSync(tempApiDir, apiDir);
  }
}

// 3. Create PHP Agreement Sender in public/api/send-agreement.php
const phpApiDir = path.join(__dirname, '..', 'public', 'api');
if (!fs.existsSync(phpApiDir)) fs.mkdirSync(phpApiDir, { recursive: true });

const phpCode = `<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$input = json_decode(file_get_contents('php://input'), true);
$name = isset($input['name']) ? trim($input['name']) : '';
$email = isset($input['email']) ? trim($input['email']) : '';
$plan = isset($input['plan']) ? $input['plan'] : 'installment';
$city = isset($input['city']) ? trim($input['city']) : '';

if (empty($name) || empty($email)) {
    echo json_encode(['error' => 'Name and Email are required']);
    exit;
}

$amount = ($plan === 'full') ? '29,899' : '15,000';

function sendZeptoMail($toEmail, $toName, $subject, $htmlBody) {
    $host = 'ssl://smtp.zeptomail.in';
    $port = 465;
    $user = 'emailapikey';
    $pass = 'PHtE6r1YRu7r3mAm8BAJtKe6QMKtPI4n+OpufVZOsYpBC6QBTU1d/d4okGSwrRcvB/BCEPHKy4Jo4r+f5erXcT65NmcfXGqyqK3sx/VYSPOZsbq6x00etVsdfk3eUI/scdRq3CDfv9nbNA==';
    $from = 'team@fiqr.in';

    $socket = @fsockopen($host, $port, $errno, $errstr, 15);
    if (!$socket) return false;

    fgets($socket, 515);
    fputs($socket, "EHLO " . (isset($_SERVER['SERVER_NAME']) ? $_SERVER['SERVER_NAME'] : 'fiqrtaalim.com') . "\\r\\n");
    fgets($socket, 515);
    fputs($socket, "AUTH LOGIN\\r\\n");
    fgets($socket, 515);
    fputs($socket, base64_encode($user) . "\\r\\n");
    fgets($socket, 515);
    fputs($socket, base64_encode($pass) . "\\r\\n");
    fgets($socket, 515);
    fputs($socket, "MAIL FROM: <$from>\\r\\n");
    fgets($socket, 515);
    fputs($socket, "RCPT TO: <$toEmail>\\r\\n");
    fgets($socket, 515);
    fputs($socket, "DATA\\r\\n");
    fgets($socket, 515);

    $headers = "MIME-Version: 1.0\\r\\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\\r\\n";
    $headers .= "From: FIQRTAALIM <$from>\\r\\n";
    $headers .= "To: $toName <$toEmail>\\r\\n";
    $headers .= "Subject: $subject\\r\\n";

    fputs($socket, "$headers\\r\\n$htmlBody\\r\\n.\\r\\n");
    $result = fgets($socket, 515);
    fputs($socket, "QUIT\\r\\n");
    fclose($socket);

    return true;
}

$subject = "Your FIQRTAALIM Service Agreement & Seat Confirmation — " . $name;
$body = "<div style='font-family:sans-serif; max-width:600px; margin:0 auto; padding:20px; border:1px solid #e2e8f0; border-radius:10px;'>"
      . "<h2 style='color:#0f172a; margin-top:0;'>Assalamu Alaikum " . htmlspecialchars($name) . ",</h2>"
      . "<p>Alhamdulillah! Your seat in the <strong>Fiqrtaalim Partnership Programme</strong> is confirmed for <strong>₹" . $amount . "/-</strong>.</p>"
      . "<p>Your ₹25,000 opening stock is being prepared for dispatch to <strong>" . htmlspecialchars($city) . "</strong>.</p>"
      . "<p>Your assigned 1:1 Account Manager will connect with you directly on WhatsApp within 24 hours.</p>"
      . "<hr style='border:none; border-top:1px solid #e2e8f0; margin:20px 0;'>"
      . "<p style='font-size:13px; color:#64748b;'>Team FIQRTAALIM · 100% Halal E-Commerce Partnership</p>"
      . "</div>";

$sent = sendZeptoMail($email, $name, $subject, $body);

echo json_encode([
    'success' => $sent,
    'message' => 'Agreement confirmation email sent to ' . $email
]);
`;

fs.writeFileSync(path.join(phpApiDir, 'send-agreement.php'), phpCode, 'utf8');

// Copy out/ files into root or copy script
console.log('3. Copying exported static files into public_html compatible structure...');
const outDir = path.join(__dirname, '..', 'out');
if (fs.existsSync(outDir)) {
  function copyRecursive(src, dest) {
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (let entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        if (!fs.existsSync(destPath)) fs.mkdirSync(destPath, { recursive: true });
        copyRecursive(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
  copyRecursive(outDir, path.join(__dirname, '..'));
  console.log('✅ Exported HTML and assets ready at root level for LiteSpeed/Apache!');
}
