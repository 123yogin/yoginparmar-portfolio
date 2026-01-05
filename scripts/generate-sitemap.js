import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = 'https://yoginparmar.dev';
const DIST_DIR = join(__dirname, '../dist');

// Load data files
const projectsData = JSON.parse(readFileSync(join(__dirname, '../src/data/projects.json'), 'utf-8'));
const blogData = JSON.parse(readFileSync(join(__dirname, '../src/data/blog.json'), 'utf-8'));

// Generate sitemap
function generateSitemap() {
  const today = new Date().toISOString().split('T')[0];
  
  const urls = [
    {
      loc: `${BASE_URL}/`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '1.0'
    },
    {
      loc: `${BASE_URL}/blog`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.9'
    },
    ...projectsData.map(project => ({
      loc: `${BASE_URL}/projects/${project.id}`,
      lastmod: project.lastUpdated || today,
      changefreq: 'monthly',
      priority: project.tier === 'tier1' ? '0.9' : '0.8'
    })),
    ...blogData.map(post => ({
      loc: `${BASE_URL}/blog/${post.slug}`,
      lastmod: post.date,
      changefreq: 'monthly',
      priority: '0.8'
    }))
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  writeFileSync(join(DIST_DIR, 'sitemap.xml'), sitemap, 'utf-8');
  console.log(`✓ Generated sitemap.xml with ${urls.length} URLs`);
}

generateSitemap();

