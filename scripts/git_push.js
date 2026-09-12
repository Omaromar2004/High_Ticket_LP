const { execSync } = require('child_process');

try {
  // Check if origin already exists, remove or set-url if needed
  try {
    execSync('git remote remove origin', { stdio: 'pipe' });
  } catch (e) {}

  execSync('git remote add origin https://github.com/Omaromar2004/High_Ticket_LP.git', { stdio: 'inherit' });
  execSync('git branch -M main', { stdio: 'inherit' });
  
  console.log('Pushing to https://github.com/Omaromar2004/High_Ticket_LP.git ...');
  const output = execSync('git push -u origin main', { encoding: 'utf8' });
  console.log('✅ PUSH SUCCESSFUL:\n' + output);
} catch (err) {
  console.error('Push error:', err.message);
  if (err.stdout) console.log('stdout:', err.stdout.toString());
  if (err.stderr) console.error('stderr:', err.stderr.toString());
}
