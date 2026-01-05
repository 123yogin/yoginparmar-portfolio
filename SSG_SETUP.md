# Static Site Generation (SSG) Setup

This React application is configured for **Static Site Generation (SSG)** to achieve maximum SEO performance without using Next.js or SSR frameworks.

## Architecture

### Build Process

1. **Standard Vite Build**: React app is built normally with `vite build`
2. **Pre-rendering**: Puppeteer crawls all routes and generates static HTML files
3. **Meta Tag Injection**: SEO meta tags are injected into static HTML at build time
4. **Sitemap Generation**: `sitemap.xml` is generated automatically
5. **Robots.txt**: `robots.txt` is generated automatically

### File Structure

```
frontend/
├── scripts/
│   ├── build-ssg.js          # Main SSG build orchestrator
│   ├── generate-static.js     # Pre-renders all routes with Puppeteer
│   ├── generate-sitemap.js   # Generates sitemap.xml
│   └── generate-robots.js    # Generates robots.txt
├── dist/                      # Build output (static HTML files)
│   ├── index.html            # Home page
│   ├── blog/
│   │   ├── index.html        # Blog listing
│   │   └── [slug]/
│   │       └── index.html    # Individual blog posts
│   ├── projects/
│   │   └── [id]/
│   │       └── index.html    # Individual projects
│   ├── sitemap.xml
│   └── robots.txt
```

## SEO Features

### ✅ Static HTML Generation
- Every route generates a real `.html` file
- Content is visible in page source (View Source)
- No JavaScript required for content visibility

### ✅ Build-Time Meta Tags
- All meta tags are injected at build time
- No client-side meta tag updates
- Unique titles, descriptions, and keywords per page

### ✅ Semantic HTML
- Proper use of `<main>`, `<article>`, `<section>`, `<header>`, `<footer>`
- Single `<h1>` per page
- Proper heading hierarchy (h1 → h2 → h3)

### ✅ Structured Data (JSON-LD)
- Person schema on home page
- WebSite schema site-wide
- BlogPosting schema for blog posts
- SoftwareApplication schema for projects
- BreadcrumbList schema for navigation

### ✅ Internal Linking
- Every page links to 2-3 relevant pages
- Descriptive anchor text
- Logical topic clusters (blogs ↔ projects)

### ✅ Technical SEO
- Clean, crawlable URLs
- `sitemap.xml` with all routes
- `robots.txt` configuration
- Canonical URLs for all pages

## Build Commands

### Standard Build (No Pre-rendering)
```bash
npm run build
```
Generates optimized React bundle but no static HTML files.

### SSG Build (With Pre-rendering)
```bash
npm run build:ssg
```
1. Builds React app
2. Starts preview server
3. Pre-renders all routes to static HTML
4. Generates sitemap.xml and robots.txt
5. Stops preview server

## Routes Generated

### Home Page
- `/` → `dist/index.html`

### Blog Pages
- `/blog` → `dist/blog/index.html`
- `/blog/[slug]` → `dist/blog/[slug]/index.html`

### Project Pages
- `/projects/[id]` → `dist/projects/[id]/index.html`

## Meta Tag Strategy

### Home Page
- **Title**: "Yogin Parmar - Junior AI Developer & Full Stack Engineer | Portfolio"
- **Description**: 150-160 characters with key projects and location
- **Keywords**: AI Developer, Full Stack, ML Engineer, etc.

### Blog Posts
- **Title**: "[Post Title] | Yogin Parmar - Technical Blog"
- **Description**: Post excerpt (140-160 chars)
- **Keywords**: Post tags + category + "Technical Blog"
- **Open Graph**: Article type with featured image
- **Structured Data**: BlogPosting schema

### Project Pages
- **Title**: "[Project Title] | Yogin Parmar - Portfolio"
- **Description**: Project description + technologies + problem statement snippet
- **Keywords**: Project title + categories + technologies
- **Structured Data**: SoftwareApplication schema

## Content Requirements

### Minimum Content Depth
- **Blog Posts**: 800+ words
- **Project Pages**: Full problem statement, architecture, trade-offs, security, performance

### Content Structure
1. Clear problem statement
2. Why existing solutions fail
3. Architecture explanation
4. Key technical decisions
5. Trade-offs and compromises
6. Security considerations
7. Performance considerations
8. Screenshots/diagrams
9. Future improvements

## Performance Budget

- **Lighthouse Score**: 90+ on mobile
- **Minimal JavaScript**: Only for interactivity, not content
- **Lazy Loading**: All images use `loading="lazy"`
- **Optimized Images**: WebP format where possible
- **No Blocking Scripts**: Above-the-fold content loads immediately

## Verification

### Check Static HTML
1. Build with `npm run build:ssg`
2. Open `dist/index.html` in a text editor
3. Verify content is in HTML (not just in `<script>` tags)
4. Verify meta tags are present in `<head>`

### Check SEO
1. View page source (not DevTools)
2. Verify `<h1>` is present
3. Verify meta description is 140-160 chars
4. Verify structured data (JSON-LD) is present
5. Verify canonical URL is correct

### Check Sitemap
1. Open `dist/sitemap.xml`
2. Verify all routes are included
3. Verify lastmod dates are current
4. Verify priorities are set correctly

## Deployment

### Static Hosting
The `dist/` folder contains fully static HTML files that can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

### Server Configuration
For proper routing, configure your server to:
- Serve `index.html` for all routes (SPA fallback)
- OR use the pre-rendered HTML files directly

### Example: Netlify
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Troubleshooting

### Pre-rendering Fails
- Ensure preview server starts successfully
- Check that all routes are accessible
- Verify Puppeteer can access localhost

### Meta Tags Missing
- Check `generate-static.js` for route matching
- Verify meta tag injection logic
- Check browser console for errors

### Content Not in HTML
- Ensure React components render content (not just state)
- Check that Puppeteer waits for content to load
- Verify `waitForSelector` in `generate-static.js`

## SEO Best Practices Enforced

1. ✅ No keyword stuffing
2. ✅ No duplicate content
3. ✅ No thin pages (< 800 words for content pages)
4. ✅ No hidden text
5. ✅ No over-optimized headings
6. ✅ No fake blog posts
7. ✅ No AI-obvious filler language
8. ✅ Descriptive alt text (no keyword stuffing)
9. ✅ Proper heading hierarchy
10. ✅ Semantic HTML only

## Next Steps

1. Run `npm run build:ssg` to generate static site
2. Verify HTML files in `dist/` folder
3. Test with `npm run preview` and check page source
4. Deploy to hosting service
5. Submit sitemap to Google Search Console

