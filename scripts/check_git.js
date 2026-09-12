const { execSync } = require('child_process');

try {
  const status = execSync('git status -s', { encoding: 'utf8' });
  const remotes = execSync('git remote -v', { encoding: 'utf8' });
  const branch = execSync('git branch --show-current', { encoding: 'utf8' });
  console.log('=== BRANCH ===\n' + branch);
  console.log('=== REMOTES ===\n' + remotes);
  console.log('=== STATUS ===\n' + status);
} catch (e) {
  console.error('Git error:', e.message);
}
