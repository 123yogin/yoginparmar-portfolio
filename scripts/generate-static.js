import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = process.env.PREVIEW_URL || 'http://localhost:4173';
console.log(`Using preview URL: ${BASE_URL}`);
const DIST_DIR = join(__dirname, '../dist');
const BUILD_DIR = join(__dirname, '../dist');

// Load data files
const projectsData = JSON.parse(readFileSync(join(__dirname, '../src/data/projects.json'), 'utf-8'));
const blogData = JSON.parse(readFileSync(join(__dirname, '../src/data/blog.json'), 'utf-8'));

// Generate all routes
const routes = [
  { path: '/', file: 'index.html' },
  { path: '/blog', file: 'blog/index.html' },
  ...projectsData.map(project => ({
    path: `/projects/${project.id}`,
    file: `projects/${project.id}/index.html`
  })),
  ...blogData.map(post => ({
    path: `/blog/${post.slug}`,
    file: `blog/${post.slug}/index.html`
  }))
];

// Generate meta tags for each route
function generateMetaTags(route, data = {}) {
  const baseUrl = 'https://yoginparmar.dev';
  const url = `${baseUrl}${route.path}`;
  
  let title = '';
  let description = '';
  let keywords = '';
  let ogImage = `${baseUrl}/og-image.png`;
  let structuredData = [];

  if (route.path === '/') {
    title = 'Yogin Parmar - Junior AI Developer & Full Stack Engineer | Portfolio';
    description = 'Junior AI Developer specializing in AI agents, full-stack development, and ML engineering. 37+ projects including IntelliHire Platform, Fake News Detection System, and healthcare ML systems. Based in Gandhinagar, Gujarat, India.';
    keywords = 'AI Developer, Full Stack Developer, Machine Learning Engineer, Python Developer, React Developer, Flask Developer, AI Agents, Computer Vision, NLP, Healthcare AI, Portfolio, Yogin Parmar, Gandhinagar, Gujarat, India';
    
    structuredData = [
      {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "mainEntity": {
          "@type": "Person",
          "name": "Yogin Parmar",
          "jobTitle": "Junior AI Developer",
          "url": baseUrl,
          "image": ogImage,
          "sameAs": [
            "https://github.com/123yogin",
            "https://linkedin.com/in/yogin-parmar-15b7aa1a8",
            "https://instagram.com/yogin_04"
          ],
          "email": "parmaryogin04@gmail.com",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Gandhinagar",
            "addressRegion": "Gujarat",
            "addressCountry": "IN"
          }
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Yogin Parmar Portfolio",
        "url": baseUrl,
        "description": "Portfolio of Yogin Parmar - Junior AI Developer specializing in AI agents, full-stack development, and ML engineering"
      }
    ];
  } else if (route.path === '/blog') {
    title = 'Technical Blog & Case Studies | Yogin Parmar - AI Developer Portfolio';
    description = 'Deep-dive technical articles on backend development, database design, AI/ML, and production-grade architecture decisions. Learn from real-world implementations and best practices.';
    keywords = 'Technical Blog, Backend Development, Database Design, AI/ML, FastAPI, PostgreSQL, Python, Architecture, Case Studies, Yogin Parmar';
    
    structuredData = [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Technical Blog & Case Studies",
        "description": description,
        "url": url,
        "mainEntity": {
          "@type": "ItemList",
          "numberOfItems": blogData.length,
          "itemListElement": blogData.map((post, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
              "@type": "BlogPosting",
              "headline": post.title,
              "url": `${baseUrl}/blog/${post.slug}`,
              "datePublished": post.date
            }
          }))
        },
        "inLanguage": "en-US"
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
          { "@type": "ListItem", "position": 2, "name": "Blog", "item": url }
        ]
      }
    ];
  } else if (route.path.startsWith('/projects/')) {
    const project = projectsData.find(p => p.id === data.slug);
    if (project) {
      title = `${project.title} | Yogin Parmar - Portfolio`;
      description = `${project.description} Built with ${project.technologies.slice(0, 3).join(', ')}. ${project.problemStatement ? project.problemStatement.substring(0, 100) + '...' : ''}`;
      keywords = `${project.title}, ${project.categories.join(', ')}, ${project.technologies.join(', ')}, Portfolio, Yogin Parmar`;
      
      structuredData = [
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": project.title,
          "description": project.description,
          "applicationCategory": "WebApplication",
          "operatingSystem": "Web",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "author": {
            "@type": "Person",
            "name": "Yogin Parmar",
            "url": baseUrl
          },
          "datePublished": project.dateCreated,
          "dateModified": project.lastUpdated,
          "url": project.links?.demo || project.links?.github || url,
          "codeRepository": project.links?.github,
          "programmingLanguage": project.technologies,
          "keywords": project.categories.join(", "),
          "inLanguage": "en-US"
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
            { "@type": "ListItem", "position": 2, "name": "Projects", "item": `${baseUrl}/#projects` },
            { "@type": "ListItem", "position": 3, "name": project.title, "item": url }
          ]
        }
      ];
    }
  } else if (route.path.startsWith('/blog/')) {
    const post = blogData.find(p => p.slug === data.slug);
    if (post) {
      title = `${post.title} | Yogin Parmar - Technical Blog`;
      description = post.excerpt;
      keywords = `${post.tags.join(', ')}, ${post.category}, Technical Blog, Yogin Parmar`;
      if (post.images && post.images.length > 0) {
        ogImage = `${baseUrl}/images/${post.images[0]}`;
      }
      
      structuredData = [
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.excerpt,
          "image": ogImage,
          "datePublished": post.date,
          "dateModified": post.date,
          "author": {
            "@type": "Person",
            "name": post.author,
            "url": baseUrl
          },
          "publisher": {
            "@type": "Person",
            "name": "Yogin Parmar",
            "url": baseUrl
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": url
          },
          "articleSection": post.category,
          "keywords": post.tags.join(", "),
          "wordCount": post.content.split(/\s+/).length,
          "timeRequired": post.readTime,
          "inLanguage": "en-US"
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${baseUrl}/blog` },
            { "@type": "ListItem", "position": 3, "name": post.title, "item": url }
          ]
        }
      ];
    }
  }

  const metaTags = `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="keywords" content="${keywords}" />
    <meta name="author" content="Yogin Parmar" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${url}" />
    
    <!-- Open Graph -->
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="${route.path.startsWith('/blog/') ? 'article' : 'website'}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${title}" />
    <meta property="og:site_name" content="Yogin Parmar Portfolio" />
    <meta property="og:locale" content="en_US" />
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${ogImage}" />
    <meta name="twitter:creator" content="@yogin_04" />
    
    ${structuredData.map((data, index) => `
    <script type="application/ld+json">
      ${JSON.stringify(data, null, 2)}
    </script>
    `).join('')}
  `;

  return { title, description, keywords, metaTags, structuredData };
}

// Pre-render a route
async function preRenderRoute(browser, route) {
  console.log(`Pre-rendering: ${route.path}`);
  
  const page = await browser.newPage();
  
  try {
    await page.goto(`${BASE_URL}${route.path}`, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Wait for content to be rendered
    await page.waitForSelector('main, article, .container', { timeout: 10000 });
    
    // Get the HTML content
    let html = await page.content();
    
    // Extract meta data
    const slug = route.path.split('/').pop();
    const metaData = generateMetaTags(route, { slug });
    
    // Replace the title tag
    html = html.replace(/<title>.*?<\/title>/s, `<title>${metaData.title}</title>`);
    
    // Replace or add meta description
    if (html.includes('<meta name="description"')) {
      html = html.replace(/<meta name="description"[^>]*>/s, `<meta name="description" content="${metaData.description}" />`);
    } else {
      html = html.replace('</head>', `    <meta name="description" content="${metaData.description}" />\n    </head>`);
    }
    
    // Replace canonical URL
    if (html.includes('<link rel="canonical"')) {
      html = html.replace(/<link rel="canonical"[^>]*>/s, `<link rel="canonical" href="https://yoginparmar.dev${route.path}" />`);
    } else {
      html = html.replace('</head>', `    <link rel="canonical" href="https://yoginparmar.dev${route.path}" />\n    </head>`);
    }
    
    // Inject Open Graph and Twitter Card tags
    const ogTags = metaData.metaTags.match(/<meta property="og:[^>]*>/g) || [];
    const twitterTags = metaData.metaTags.match(/<meta name="twitter:[^>]*>/g) || [];
    
    // Remove existing OG and Twitter tags
    html = html.replace(/<meta property="og:[^>]*>/g, '');
    html = html.replace(/<meta name="twitter:[^>]*>/g, '');
    
    // Add new OG and Twitter tags before </head>
    const newTags = [...ogTags, ...twitterTags].join('\n    ');
    html = html.replace('</head>', `    ${newTags}\n    </head>`);
    
    // Inject structured data
    metaData.structuredData.forEach((data, index) => {
      const jsonLd = `<script type="application/ld+json">\n      ${JSON.stringify(data, null, 2)}\n    </script>`;
      if (!html.includes(`"@type": "${data['@type']}"`)) {
        html = html.replace('</head>', `    ${jsonLd}\n    </head>`);
      }
    });
    
    // Ensure content is in HTML (not just in React)
    // The HTML should already contain the rendered content from Puppeteer
    
    // Create directory if it doesn't exist
    const filePath = join(BUILD_DIR, route.file);
    const fileDir = dirname(filePath);
    if (!existsSync(fileDir)) {
      mkdirSync(fileDir, { recursive: true });
    }
    
    // Write the HTML file
    writeFileSync(filePath, html, 'utf-8');
    console.log(`✓ Generated: ${route.file}`);
    
  } catch (error) {
    console.error(`✗ Error pre-rendering ${route.path}:`, error.message);
  } finally {
    await page.close();
  }
}

// Main function
async function generateStatic() {
  console.log('Starting static site generation...');
  
  // Start a local preview server (assumes preview server is running)
  console.log(`Using base URL: ${BASE_URL}`);
  console.log('Make sure the preview server is running (npm run preview)');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    // Pre-render all routes
    for (const route of routes) {
      await preRenderRoute(browser, route);
    }
    
    console.log(`\n✓ Successfully generated ${routes.length} static pages`);
  } catch (error) {
    console.error('Error during static generation:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Export for use in build-ssg.js, but also allow direct execution
const isMainModule = import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}` || 
                     process.argv[1]?.includes('generate-static.js');

if (isMainModule) {
  generateStatic();
}

export default generateStatic;

