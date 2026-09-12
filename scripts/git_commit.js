const { execSync } = require('child_process');

try {
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "feat: Add installment landing page, form UX, Razorpay checkout, and ZeptoMail agreement automation"', { stdio: 'inherit' });
  const log = execSync('git log -n 1 --oneline', { encoding: 'utf8' });
  console.log('✅ Commit successful:\n' + log);
} catch (err) {
  console.error('Git commit error:', err.message);
}
