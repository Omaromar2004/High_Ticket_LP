const { execSync } = require('child_process');

try {
  console.log('Building Next.js export...');
  const res = execSync('npx next build', { encoding: 'utf8' });
  console.log('Build result:\n', res);
} catch (e) {
  console.error('Build error:\n', e.stdout || e.message);
}
