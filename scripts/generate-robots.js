import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DIST_DIR = join(__dirname, '../dist');
const BASE_URL = 'https://yoginparmar.dev';

function generateRobots() {
  const robots = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${BASE_URL}/sitemap.xml

# Disallow admin or private areas if any
# Disallow: /admin/

# Crawl-delay (optional)
Crawl-delay: 1
`;

  writeFileSync(join(DIST_DIR, 'robots.txt'), robots, 'utf-8');
  console.log('✓ Generated robots.txt');
}

generateRobots();

