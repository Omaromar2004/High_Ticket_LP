const { execSync } = require('child_process');

try {
  execSync('git add app/installments/page.tsx .htaccess', { stdio: 'inherit' });
  execSync('git commit -m "add: /installments plural route and .htaccess for Hostinger routing"', { stdio: 'inherit' });
  execSync('git push origin main', { stdio: 'inherit' });
  console.log('✅ Pushed /installments route and .htaccess to GitHub');
} catch (e) {
  console.error('Error:', e.message);
}
