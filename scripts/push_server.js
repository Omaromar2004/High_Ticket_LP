const { execSync } = require('child_process');

try {
  execSync('git add server.js', { stdio: 'inherit' });
  execSync('git commit -m "add: server.js custom entrypoint for Hostinger Node.js deployment"', { stdio: 'inherit' });
  execSync('git push origin main', { stdio: 'inherit' });
  console.log('✅ server.js pushed to GitHub successfully');
} catch (e) {
  console.error('Error:', e.message);
}
