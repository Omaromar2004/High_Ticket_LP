const { execSync } = require('child_process');

try {
  const ghVersion = execSync('gh --version', { encoding: 'utf8' });
  console.log('GitHub CLI is installed:', ghVersion.split('\n')[0]);
  
  const auth = execSync('gh auth status', { encoding: 'utf8' });
  console.log('Auth status:', auth);

  console.log('Creating repository fiqrtaalim-landing on GitHub...');
  const createResult = execSync('gh repo create fiqrtaalim-landing --public --source=. --remote=origin --push', { encoding: 'utf8' });
  console.log('✅ Repo created & pushed successfully:', createResult);
} catch (err) {
  console.error('Error with gh:', err.message);
  if (err.stdout) console.log('stdout:', err.stdout.toString());
  if (err.stderr) console.error('stderr:', err.stderr.toString());
}
