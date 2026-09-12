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

// 3. Create PHP Endpoints in public/api/ and api/
const phpApiDir = path.join(__dirname, '..', 'public', 'api');
if (!fs.existsSync(phpApiDir)) fs.mkdirSync(phpApiDir, { recursive: true });

const rootApiDir = path.join(__dirname, '..', 'api');
if (!fs.existsSync(rootApiDir)) fs.mkdirSync(rootApiDir, { recursive: true });

const phpSource = fs.readFileSync(path.join(phpApiDir, 'send-agreement.php'), 'utf8');
fs.writeFileSync(path.join(rootApiDir, 'send-agreement.php'), phpSource, 'utf8');

if (fs.existsSync(path.join(phpApiDir, 'view-leads.php'))) {
  const leadsViewerSource = fs.readFileSync(path.join(phpApiDir, 'view-leads.php'), 'utf8');
  fs.writeFileSync(path.join(rootApiDir, 'view-leads.php'), leadsViewerSource, 'utf8');
}

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
