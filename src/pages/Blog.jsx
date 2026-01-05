import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import blogData from '../data/blog.json';
import Navigation from '../components/Navigation/Navigation';
import Footer from '../components/Footer/Footer';
import Background from '../components/Background/Background';
import './Blog.css';

const Blog = () => {
  return (
    <div className="App">
      <Helmet>
        <title>Technical Blog & Case Studies | Yogin Parmar - AI Developer Portfolio</title>
        <meta name="description" content="Deep-dive technical articles on backend development, database design, AI/ML, and production-grade architecture decisions. Learn from real-world implementations and best practices." />
        <meta name="keywords" content="Technical Blog, Backend Development, Database Design, AI/ML, FastAPI, PostgreSQL, Python, Architecture, Case Studies, Yogin Parmar" />
        <meta property="og:title" content="Technical Blog & Case Studies | Yogin Parmar" />
        <meta property="og:description" content="Deep-dive technical articles on backend development, database design, and production-grade architecture decisions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yoginparmar.dev/blog" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Technical Blog & Case Studies" />
        <meta name="twitter:description" content="Deep-dive technical articles on backend development and architecture." />
        <link rel="canonical" href="https://yoginparmar.dev/blog" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Technical Blog & Case Studies",
            "description": "Deep-dive technical articles on backend development, database design, AI/ML, and production-grade architecture decisions.",
            "url": "https://yoginparmar.dev/blog",
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": blogData.length,
              "itemListElement": blogData.map((post, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "BlogPosting",
                  "headline": post.title,
                  "url": `https://yoginparmar.dev/blog/${post.slug}`,
                  "datePublished": post.date
                }
              }))
            },
            "inLanguage": "en-US"
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://yoginparmar.dev"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": "https://yoginparmar.dev/blog"
              }
            ]
          })}
        </script>
      </Helmet>
      <Background />
      <Navigation />
      <main className="blog-page">
        <div className="container">
          <header className="blog-header">
            <h1 className="blog-title">Technical Blog & Case Studies</h1>
            <p className="blog-subtitle">
              Deep-dive technical articles on backend development, database design, 
              and production-grade architecture decisions.
            </p>
          </header>

          <div className="blog-grid">
            {blogData.map(post => (
              <article key={post.id} className="blog-card">
                <div className="blog-card-header">
                  <span className="blog-category">{post.category}</span>
                  <div className="blog-meta">
                    <span className="blog-date">
                      <Calendar size={14} />
                      {new Date(post.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                    <span className="blog-read-time">
                      <Clock size={14} />
                      {post.readTime}
                    </span>
                  </div>
                </div>
                
                <h2 className="blog-card-title">
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                
                <p className="blog-excerpt">{post.excerpt}</p>
                
                <div className="blog-tags">
                  {post.tags.map(tag => (
                    <span key={tag} className="blog-tag">{tag}</span>
                  ))}
                </div>
                
                <Link to={`/blog/${post.slug}`} className="blog-read-more">
                  Read Article <ArrowRight size={16} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;

