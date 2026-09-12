<?php
session_start();

$ADMIN_PASSWORD = 'fiqr'; // Access password

// Check auth via GET param or Session
if (isset($_GET['pass']) && $_GET['pass'] === $ADMIN_PASSWORD) {
    $_SESSION['authenticated'] = true;
}

if (isset($_POST['password'])) {
    if ($_POST['password'] === $ADMIN_PASSWORD) {
        $_SESSION['authenticated'] = true;
    } else {
        $error = "Incorrect Password. Please try again.";
    }
}

if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    unset($_SESSION['authenticated']);
    session_destroy();
    header("Location: view-leads.php");
    exit;
}

// Download CSV
if (isset($_GET['action']) && $_GET['action'] === 'download_csv' && !empty($_SESSION['authenticated'])) {
    $csvFile = __DIR__ . '/data/leads.csv';
    if (file_exists($csvFile)) {
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="fiqrtaalim_leads_' . date('Y-m-d') . '.csv"');
        readfile($csvFile);
        exit;
    } else {
        die("No leads CSV recorded yet.");
    }
}

$isAuthenticated = !empty($_SESSION['authenticated']);

// Read Leads
$leads = [];
$jsonFile = __DIR__ . '/data/leads.json';
if (file_exists($jsonFile)) {
    $raw = @file_get_contents($jsonFile);
    $leads = json_decode($raw, true) ?: [];
    $leads = array_reverse($leads); // Newest first
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FIQRTAALIM — Leads Dashboard</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #0C0B09;
      color: #F5EFE6;
      min-height: 100vh;
      padding: 24px 16px;
    }
    .container { max-width: 1050px; margin: 0 auto; }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 20px;
      border-bottom: 1px solid rgba(230,202,133,0.25);
      margin-bottom: 24px;
    }
    .header h1 {
      font-size: 20px;
      color: #E6CA85;
      letter-spacing: 1px;
    }
    .header p {
      font-size: 12px;
      color: rgba(245,239,230,0.6);
      margin-top: 3px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }
    .btn-gold {
      background: linear-gradient(135deg, #E6CA85, #C99E26);
      color: #0A0908;
    }
    .btn-gold:hover { opacity: 0.9; }
    .btn-ghost {
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(230,202,133,0.3);
      color: #F5EFE6;
    }
    .btn-ghost:hover { background: rgba(255,255,255,0.12); }
    .btn-wa {
      background: #10B981;
      color: #fff;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
    }
    .btn-wa:hover { background: #059669; }
    .card {
      background: #14110C;
      border: 1px solid rgba(230,202,133,0.25);
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .stat-box {
      background: #18140F;
      border: 1px solid rgba(230,202,133,0.2);
      border-radius: 10px;
      padding: 16px;
    }
    .stat-label { font-size: 11px; color: #E6CA85; text-transform: uppercase; font-weight: 600; }
    .stat-val { font-size: 24px; font-weight: 700; color: #FFFDF8; margin-top: 4px; }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12.5px;
      text-align: left;
    }
    th {
      background: #1C1712;
      color: #E6CA85;
      font-weight: 600;
      padding: 12px 14px;
      border-bottom: 1px solid rgba(230,202,133,0.25);
      font-size: 11.5px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    td {
      padding: 12px 14px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      color: rgba(245,239,230,0.88);
    }
    tr:hover td { background: rgba(230,202,133,0.04); }
    .badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
    }
    .badge-half { background: rgba(16,185,129,0.15); color: #10B981; border: 1px solid rgba(16,185,129,0.3); }
    .badge-full { background: rgba(230,202,133,0.15); color: #E6CA85; border: 1px solid rgba(230,202,133,0.3); }
    .empty-state { text-align: center; padding: 40px 20px; color: rgba(245,239,230,0.5); }
    .login-box {
      max-width: 360px;
      margin: 80px auto;
      background: #14110C;
      border: 1px solid rgba(230,202,133,0.35);
      border-radius: 16px;
      padding: 30px 24px;
      text-align: center;
      box-shadow: 0 20px 50px rgba(0,0,0,0.8);
    }
    .input-pass {
      width: 100%;
      background: #1D1913;
      border: 1px solid rgba(230,202,133,0.3);
      color: #fff;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 14px;
      margin: 16px 0;
      outline: none;
    }
    .input-pass:focus { border-color: #E6CA85; }
  </style>
</head>
<body>
<div class="container">
  <?php if (!$isAuthenticated): ?>
    <div class="login-box">
      <h2 style="color:#E6CA85; font-size: 18px; margin-bottom: 6px;">FIQRTAALIM</h2>
      <p style="font-size: 12px; color: rgba(245,239,230,0.6); margin-bottom: 20px;">Leads Management Desk</p>
      
      <?php if (!empty($error)): ?>
        <p style="color: #ef4444; font-size: 12px; margin-bottom: 12px;"><?= htmlspecialchars($error) ?></p>
      <?php endif; ?>

      <form method="POST">
        <input type="password" name="password" class="input-pass" placeholder="Enter Access Password" required autofocus>
        <button type="submit" class="btn btn-gold" style="width: 100%; justify-content: center; padding: 11px;">Unlock Dashboard</button>
      </form>
    </div>
  <?php else: ?>
    <!-- Logged in view -->
    <div class="header">
      <div>
        <h1>FIQRTAALIM LEADS DESK</h1>
        <p>Real-time list of all visitors who submitted the Partnership Form</p>
      </div>
      <div style="display: flex; gap: 10px;">
        <a href="view-leads.php?action=download_csv" class="btn btn-gold">📥 Export CSV (Excel)</a>
        <a href="view-leads.php?action=logout" class="btn btn-ghost">Logout</a>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="stats">
      <div class="stat-box">
        <div class="stat-label">Total Leads Captured</div>
        <div class="stat-val"><?= count($leads) ?></div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Half Payment (₹15k)</div>
        <div class="stat-val">
          <?= count(array_filter($leads, function($l) { return ($l['plan'] ?? '') === 'installment'; })) ?>
        </div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Full Payment (₹29.8k)</div>
        <div class="stat-val">
          <?= count(array_filter($leads, function($l) { return ($l['plan'] ?? '') === 'full'; })) ?>
        </div>
      </div>
    </div>

    <!-- Leads Table -->
    <div class="card">
      <?php if (empty($leads)): ?>
        <div class="empty-state">
          <p>No leads recorded yet.</p>
          <p style="font-size: 11px; margin-top: 6px;">As soon as someone fills the form on fiqrtaalim.com/installment, they will appear here instantly.</p>
        </div>
      <?php else: ?>
        <div style="overflow-x: auto;">
          <table>
            <thead>
              <tr>
                <th>Date &amp; Time</th>
                <th>Name</th>
                <th>Email</th>
                <th>WhatsApp Phone</th>
                <th>Delivery City</th>
                <th>Plan Chosen</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach ($leads as $lead): ?>
                <?php 
                  $cleanPh = preg_replace('/\D/', '', $lead['phone'] ?? '');
                  $isHalf = ($lead['plan'] ?? '') === 'installment';
                ?>
                <tr>
                  <td style="font-size: 11px; color: rgba(245,239,230,0.6); white-space: nowrap;">
                    <?= htmlspecialchars($lead['timestamp'] ?? 'N/A') ?>
                  </td>
                  <td><strong><?= htmlspecialchars($lead['name'] ?? 'N/A') ?></strong></td>
                  <td>
                    <a href="mailto:<?= htmlspecialchars($lead['email'] ?? '') ?>" style="color: #60a5fa; text-decoration: none;">
                      <?= htmlspecialchars($lead['email'] ?? 'N/A') ?>
                    </a>
                  </td>
                  <td>
                    <span style="font-family: monospace;">+91 <?= htmlspecialchars($cleanPh) ?></span>
                  </td>
                  <td><?= htmlspecialchars($lead['city'] ?? 'N/A') ?></td>
                  <td>
                    <span class="badge <?= $isHalf ? 'badge-half' : 'badge-full' ?>">
                      <?= $isHalf ? 'Half Payment' : 'Full Payment' ?>
                    </span>
                  </td>
                  <td style="font-weight: 700; color: #E6CA85;">
                    ₹<?= htmlspecialchars($lead['amount'] ?? ($isHalf ? '15,000' : '29,899')) ?>
                  </td>
                  <td>
                    <?php if (!empty($cleanPh)): ?>
                      <a href="https://wa.me/91<?= $cleanPh ?>?text=Assalamu%20Alaikum%20<?= urlencode($lead['name'] ?? '') ?>%2C%20this%20is%20Mohammed%20Omar%20from%20FIQRTAALIM%20regarding%20your%20Partnership%20enrollment." 
                         target="_blank" 
                         class="btn btn-wa">
                        WhatsApp →
                      </a>
                    <?php endif; ?>
                  </td>
                </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      <?php endif; ?>
    </div>
  <?php endif; ?>
</div>
</body>
</html>
