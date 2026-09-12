const { execSync } = require('child_process');

try {
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "build: Static HTML export ready for instant Hostinger LiteSpeed deployment"', { stdio: 'inherit' });
  execSync('git push origin main', { stdio: 'inherit' });
  console.log('✅ Static build and routes pushed to GitHub successfully!');
} catch (e) {
  console.error('Git push error:', e.message);
}
