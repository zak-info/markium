import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Routes to pre-render
const routesToPrerender = [
  '/product/1',
  '/product/2',
  // Add more product IDs as needed
];

async function prerender() {
  const distPath = path.resolve(__dirname, '../dist');
  const indexHtml = fs.readFileSync(path.join(distPath, 'index.html'), 'utf-8');

  for (const route of routesToPrerender) {
    const routePath = path.join(distPath, route);

    // Create directory structure
    fs.mkdirSync(routePath, { recursive: true });

    // Write index.html to the route path
    fs.writeFileSync(path.join(routePath, 'index.html'), indexHtml);

    console.log(`✓ Pre-rendered: ${route}`);
  }

  console.log('\n✅ Pre-rendering complete!');
}

prerender().catch((err) => {
  console.error('Pre-rendering failed:', err);
  process.exit(1);
});
