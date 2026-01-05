# Yogin Parmar - Portfolio Website

A modern, SEO-optimized portfolio website showcasing projects, experience, and technical blog posts. Built with React and Vite, featuring static site generation (SSG) for maximum SEO performance.

## 🚀 Features

### Core Sections
- **Hero Section** - Animated introduction with code snippet visualization
- **About** - Professional background and statistics
- **Skills** - Filterable skill showcase with categories
- **Projects** - 37+ projects with tier-based organization and search functionality
- **Experience** - Professional journey timeline with expandable details
- **Contact** - Form with validation and feedback
- **Blog** - Technical articles with architecture diagrams and deep-dive content

### Technical Features
- ✅ **Static Site Generation (SSG)** - Pre-rendered HTML for SEO
- ✅ **SEO Optimized** - Meta tags, structured data, sitemap, robots.txt
- ✅ **Responsive Design** - Mobile-first, works on all devices
- ✅ **Performance Optimized** - Code splitting, lazy loading, optimized assets
- ✅ **Accessibility** - Semantic HTML, ARIA labels, keyboard navigation
- ✅ **Modern UI/UX** - Animated backgrounds, smooth transitions, interactive elements
- ✅ **Multi-page Routing** - Individual pages for projects and blog posts
- ✅ **Dynamic Meta Tags** - Unique SEO tags for each page

## 🛠️ Tech Stack

### Core
- **React 18.2** - UI library
- **Vite 7.2** (rolldown-vite) - Build tool and dev server
- **React Router DOM 7.11** - Client-side routing

### UI & Styling
- **Lucide React** - Icon library
- **CSS3** - Custom styling with animations
- **CSS Variables** - Design system with theme colors

### SEO & Meta
- **react-helmet-async** - Dynamic meta tag management
- **Structured Data (JSON-LD)** - Schema.org markup
- **Puppeteer** - Static site pre-rendering

### Data Management
- **JSON Files** - Projects, blog posts, experience, skills data

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── About/          # About section
│   │   ├── Background/     # Animated background effects
│   │   ├── Contact/        # Contact form
│   │   ├── Experience/     # Professional experience timeline
│   │   ├── Footer/         # Site footer
│   │   ├── Hero/           # Hero section with code visual
│   │   ├── Navigation/     # Main navigation bar
│   │   ├── Projects/       # Projects showcase
│   │   └── Skills/         # Skills display
│   ├── pages/              # Page components
│   │   ├── Home.jsx        # Main landing page
│   │   ├── Blog.jsx        # Blog listing page
│   │   ├── BlogPost.jsx    # Individual blog post page
│   │   └── ProjectDetail.jsx # Individual project page
│   ├── data/               # JSON data files
│   │   ├── blog.json       # Blog posts data
│   │   ├── experience.json # Work/education timeline
│   │   ├── projects.json   # Projects portfolio
│   │   └── skills.json     # Skills and technologies
│   ├── assets/             # Static assets
│   │   ├── yp.jpg         # Profile image
│   │   ├── YOGIN-PARMAR-Java Resume-20251125.pdf
│   │   └── [architecture diagrams]
│   ├── styles/             # Global styles
│   │   ├── animations.css  # Keyframe animations
│   │   ├── globals.css     # Global styles
│   │   ├── responsive.css  # Media queries
│   │   └── variables.css   # CSS variables
│   ├── App.jsx             # Main app component with routing
│   └── main.jsx            # Entry point
├── scripts/                 # Build scripts
│   ├── build-ssg.js        # SSG build orchestrator
│   ├── generate-static.js  # Pre-render routes with Puppeteer
│   ├── generate-sitemap.js # Generate sitemap.xml
│   └── generate-robots.js  # Generate robots.txt
├── public/                  # Public assets
│   ├── images/             # Blog post images
│   ├── manifest.json       # PWA manifest
│   ├── robots.txt          # Robots file (generated)
│   └── sitemap.xml         # Sitemap (generated)
└── dist/                    # Build output (static HTML files)
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and npm
- **Git** (for cloning)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5175`

## 📜 Available Scripts

### Development
```bash
npm run dev              # Start dev server on port 5175
npm run dev:check        # Start dev server and open browser
```

### Building
```bash
npm run build            # Standard build (React bundle + sitemap + robots)
npm run build:ssg        # SSG build (pre-renders all routes to static HTML)
```

### Other
```bash
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm run ssg:prerender    # Pre-render routes (requires preview server)
```

## 🔧 Build Process

### Standard Build
The standard build creates an optimized React bundle:
```bash
npm run build
```
This generates:
- Optimized JavaScript bundles (code-split)
- Minified CSS
- `sitemap.xml` with all routes
- `robots.txt` configuration

### Static Site Generation (SSG)
For maximum SEO, use SSG build:
```bash
npm run build:ssg
```

This process:
1. Builds the React application
2. Starts a preview server
3. Pre-renders all routes using Puppeteer
4. Generates static HTML files for each route
5. Injects SEO meta tags into static HTML
6. Generates `sitemap.xml` and `robots.txt`
7. Stops the preview server

**Output:** Fully static HTML files in `dist/` that are indexable without JavaScript execution.

## 📄 Generated Routes

### Static HTML Files
- `/` → `dist/index.html` (Home page)
- `/blog` → `dist/blog/index.html` (Blog listing)
- `/blog/[slug]` → `dist/blog/[slug]/index.html` (6 blog posts)
- `/projects/[id]` → `dist/projects/[id]/index.html` (7 projects)

**Total:** 15 pre-rendered static HTML pages

## 🎨 Customization

### Update Personal Information
Edit the following files:
- `src/data/projects.json` - Your projects
- `src/data/experience.json` - Work/education history
- `src/data/skills.json` - Skills and technologies
- `src/data/blog.json` - Blog posts
- `src/components/About/About.jsx` - About section content
- `src/components/Hero/Hero.jsx` - Hero section content

### Styling
- **Colors:** Edit `src/styles/variables.css`
- **Global Styles:** Edit `src/styles/globals.css`
- **Animations:** Edit `src/styles/animations.css`
- **Responsive:** Edit `src/styles/responsive.css`

### SEO Configuration
- **Meta Tags:** Updated in each page component using `react-helmet-async`
- **Structured Data:** JSON-LD schemas in page components
- **Sitemap:** Auto-generated from routes in `scripts/generate-sitemap.js`
- **Robots.txt:** Configured in `scripts/generate-robots.js`

## 🔍 SEO Features

### Implemented
- ✅ Static HTML generation (SSG)
- ✅ Unique meta tags per page (title, description, keywords)
- ✅ Open Graph tags for social sharing
- ✅ Twitter Card tags
- ✅ Canonical URLs
- ✅ Structured data (JSON-LD):
  - Person schema
  - WebSite schema
  - BlogPosting schema
  - SoftwareApplication schema
  - BreadcrumbList schema
- ✅ Semantic HTML (`<main>`, `<article>`, `<section>`, `<header>`, `<footer>`)
- ✅ Proper heading hierarchy (single H1 per page)
- ✅ `sitemap.xml` with all routes
- ✅ `robots.txt` configuration
- ✅ Image alt text and lazy loading
- ✅ Mobile-responsive design
- ✅ Fast loading (code splitting, lazy loading)

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

## 🚀 Deployment

### Static Hosting
The `dist/` folder contains fully static files that can be deployed to:
- **Netlify** - Drag & drop `dist/` folder
- **Vercel** - Connect repository, set build command: `npm run build:ssg`
- **GitHub Pages** - Deploy `dist/` folder
- **AWS S3 + CloudFront** - Upload `dist/` contents
- **Any static hosting service**

### Server Configuration
For proper routing, configure your server to:
- Serve `index.html` for all routes (SPA fallback)
- OR use the pre-rendered HTML files directly (recommended for SEO)

### Example: Netlify
```toml
# netlify.toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Post-Deployment
1. Submit `sitemap.xml` to Google Search Console
2. Verify structured data with [Google Rich Results Test](https://search.google.com/test/rich-results)
3. Test mobile-friendliness with [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

## 🐛 Troubleshooting

### Build Issues
- **Port already in use:** Change port in `vite.config.js` or kill the process using the port
- **Puppeteer errors:** Ensure all dependencies are installed (`npm install`)
- **SSG build fails:** Make sure preview server starts successfully

### Development Issues
- **Hot reload not working:** Restart dev server
- **Styles not updating:** Clear browser cache
- **Routing issues:** Check `App.jsx` route configuration

## 📝 License

This project is private and proprietary.

## 👤 Author

**Yogin Parmar**
- Portfolio: [yoginparmar.dev](https://yoginparmar.dev)
- GitHub: [@123yogin](https://github.com/123yogin)
- LinkedIn: [yogin-parmar-15b7aa1a8](https://linkedin.com/in/yogin-parmar-15b7aa1a8)
- Email: parmaryogin04@gmail.com

## 🙏 Acknowledgments

- Built with [React](https://react.dev/) and [Vite](https://vite.dev/)
- Icons from [Lucide](https://lucide.dev/)
- Design inspiration from modern portfolio websites

---

**Last Updated:** January 2025  
**Version:** 1.0.0  
**Status:** Production Ready ✅
