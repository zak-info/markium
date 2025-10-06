import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Mock products - Replace with real API calls when available
const mockProducts = [
  {
    id: 1,
    name: "ASDASD",
    description: "ASDASD",
    images: [
      "http://be.markium.online/storage/products/2/fEdo4XVKeuzxON0DHX6SmsAtlAldnNX9LLouB7fP.png",
      "http://be.markium.online/storage/products/2/7OsNT3PV5sPz6KBBW5FKTyrPKwfy5NHmH7KuDAZl.jpg"
    ],
    quantity: 100,
    category: "clothing",
    variations: ["Size S", "Size M", "Size L"],
    colors: ["Red", "Blue"],
    tags: ["premium", "cotton"],
    real_price: "39.99",
    sale_price: "29.99",
    status: "processing",
    has_discount: true,
    discount_percentage: 25.01,
    savings_amount: 10.00,
    is_in_stock: true,
  },
  {
    id: 2,
    name: "Premium T-Shirt",
    description: "High quality cotton t-shirt",
    images: ["http://be.markium.online/storage/products/2/example.jpg"],
    quantity: 50,
    category: "clothing",
    variations: ["Size M", "Size L"],
    colors: ["Black", "White"],
    tags: ["casual", "summer"],
    real_price: "49.99",
    sale_price: "39.99",
    status: "active",
    has_discount: true,
    discount_percentage: 20,
    savings_amount: 10.00,
    is_in_stock: true,
  },
];

// Simple product page component for SSR
const ProductPageSSR = ({ product }) => {
  const discount = product.has_discount;
  const oldPrice = discount ? `$${product.real_price}` : null;
  const currentPrice = `$${product.sale_price}`;

  return React.createElement('div', { className: 'product-page', style: { padding: '20px', maxWidth: '1200px', margin: '0 auto' } },
    React.createElement('div', { className: 'product-header' },
      React.createElement('h1', { style: { fontSize: '32px', marginBottom: '16px' } }, product.name),
      product.has_discount && React.createElement('div', {
        className: 'discount-badge',
        style: { display: 'inline-block', backgroundColor: '#ff4444', color: 'white', padding: '4px 12px', borderRadius: '4px', fontSize: '14px', marginBottom: '16px' }
      }, `${Math.round(product.discount_percentage)}% OFF`)
    ),
    React.createElement('div', { className: 'product-images', style: { marginBottom: '24px' } },
      product.images && product.images.length > 0 && React.createElement('img', {
        src: product.images[0],
        alt: product.name,
        style: { maxWidth: '600px', width: '100%', borderRadius: '8px' }
      })
    ),
    React.createElement('div', { className: 'price', style: { fontSize: '28px', marginBottom: '16px' } },
      discount && React.createElement('span', {
        className: 'old-price',
        style: { textDecoration: 'line-through', color: '#999', marginRight: '12px' }
      }, oldPrice),
      React.createElement('span', {
        className: 'current-price',
        style: { color: '#2e7d32', fontWeight: 'bold' }
      }, currentPrice)
    ),
    React.createElement('p', { style: { fontSize: '16px', lineHeight: '1.6', marginBottom: '24px', color: '#666' } }, product.description),
    React.createElement('div', { className: 'meta', style: { borderTop: '1px solid #eee', paddingTop: '24px' } },
      React.createElement('p', { style: { marginBottom: '12px' } },
        React.createElement('strong', null, 'Category: '),
        product.category
      ),
      React.createElement('p', { style: { marginBottom: '12px' } },
        React.createElement('strong', null, 'In Stock: '),
        `${product.quantity} units`,
        React.createElement('span', {
          style: {
            marginLeft: '12px',
            color: product.is_in_stock ? '#2e7d32' : '#d32f2f',
            fontWeight: 'bold'
          }
        }, product.is_in_stock ? '✓ Available' : '✗ Out of Stock')
      ),
      product.colors && product.colors.length > 0 && React.createElement('p', { style: { marginBottom: '12px' } },
        React.createElement('strong', null, 'Colors: '),
        product.colors.join(', ')
      ),
      product.variations && product.variations.length > 0 && React.createElement('p', { style: { marginBottom: '12px' } },
        React.createElement('strong', null, 'Sizes: '),
        product.variations.join(', ')
      ),
      product.tags && product.tags.length > 0 && React.createElement('p', { style: { marginBottom: '12px' } },
        React.createElement('strong', null, 'Tags: '),
        product.tags.map((tag, i) =>
          React.createElement('span', {
            key: i,
            style: {
              display: 'inline-block',
              backgroundColor: '#f5f5f5',
              padding: '4px 8px',
              borderRadius: '4px',
              marginRight: '8px',
              fontSize: '14px'
            }
          }, tag)
        )
      )
    )
  );
};

async function prerenderSSR() {
  const distPath = path.resolve(__dirname, '../dist');

  // Check if dist folder exists
  if (!fs.existsSync(distPath)) {
    console.error('❌ dist folder not found. Please run "npm run build" first.');
    process.exit(1);
  }

  const templateHtml = fs.readFileSync(path.join(distPath, 'index.html'), 'utf-8');

  console.log('\n🚀 Starting SSR pre-rendering with mock data...\n');
  console.log(`📦 Pre-rendering ${mockProducts.length} products\n`);

  let successCount = 0;

  for (const product of mockProducts) {
    const route = `/product/${product.id}`;
    const routePath = path.join(distPath, 'product', String(product.id));

    // Create directory structure
    fs.mkdirSync(routePath, { recursive: true });

    // Render React component to HTML string
    const appHtml = ReactDOMServer.renderToString(
      React.createElement(ProductPageSSR, { product })
    );

    // Inject the rendered HTML into the root div
    const html = templateHtml.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div><script>window.__INITIAL_PRODUCT__ = ${JSON.stringify(product)};</script>`
    );

    // Escape description for meta tags
    const safeDescription = (product.description || '').replace(/"/g, '&quot;').substring(0, 160);
    const safeTitle = (product.name || 'Product').replace(/"/g, '&quot;');

    // Add meta tags for SEO
    const htmlWithMeta = html.replace(
      '<title>Markium</title>',
      `<title>${safeTitle} - Markium</title>
    <meta name="description" content="${safeDescription}">
    <meta property="og:title" content="${safeTitle}">
    <meta property="og:description" content="${safeDescription}">
    <meta property="og:image" content="${product.images?.[0] || ''}">
    <meta property="og:type" content="product">
    <meta property="product:price:amount" content="${product.sale_price}">
    <meta property="product:price:currency" content="USD">
    <meta property="og:availability" content="${product.is_in_stock ? 'in stock' : 'out of stock'}">
    ${product.has_discount ? `<meta property="product:sale_price:amount" content="${product.sale_price}">` : ''}`
    );

    // Write to file
    fs.writeFileSync(path.join(routePath, 'index.html'), htmlWithMeta);

    console.log(`✅ ${route} - ${safeTitle}`);
    successCount++;
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ SSR Pre-rendering complete!`);
  console.log(`📊 Success: ${successCount} products`);
  console.log('='.repeat(50));
  console.log('\n💡 Static files generated in: dist/product/');
  console.log('🌐 Each product has SEO-optimized HTML with meta tags');
  console.log('⚡ React will hydrate the pre-rendered content on load');
  console.log('\n📝 To use real API data:');
  console.log('   Edit scripts/prerender-ssr.js and replace mockProducts');
  console.log('   with actual API calls to your backend\n');
}

prerenderSSR().catch((err) => {
  console.error('\n❌ SSR Pre-rendering failed:', err);
  process.exit(1);
});
