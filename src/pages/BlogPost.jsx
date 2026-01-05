import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react';
import blogData from '../data/blog.json';
import Navigation from '../components/Navigation/Navigation';
import Footer from '../components/Footer/Footer';
import Background from '../components/Background/Background';
import './BlogPost.css';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = blogData.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="App">
        <Navigation />
        <main className="blog-post-not-found">
          <div className="container">
            <h1>Article Not Found</h1>
            <p>The article you're looking for doesn't exist.</p>
            <Link to="/blog" className="btn btn-primary">Back to Blog</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formatContent = (content) => {
    // Enhanced markdown-like formatting with image support
    const lines = content.split('\n');
    let inCodeBlock = false;
    let codeBlockContent = [];
    let codeBlockLanguage = '';
    
    return lines.map((line, index) => {
      // Image support: ![alt text](image-url)
      if (line.match(/^!\[.*?\]\(.*?\)$/)) {
        const match = line.match(/^!\[(.*?)\]\((.*?)\)$/);
        if (match) {
          const [, alt, src] = match;
          return (
            <figure key={index} className="blog-content-image">
              <img 
                src={src.startsWith('http') ? src : `/images/${src}`} 
                alt={alt}
                loading="lazy"
              />
              {alt && <figcaption>{alt}</figcaption>}
            </figure>
          );
        }
      }
      
      // Code blocks
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeBlockContent = [];
          codeBlockLanguage = line.substring(3).trim();
          return null;
        } else {
          inCodeBlock = false;
          const code = codeBlockContent.join('\n');
          codeBlockContent = [];
          return (
            <pre key={index} className="blog-content-code-block">
              <code className={`language-${codeBlockLanguage}`}>{code}</code>
            </pre>
          );
        }
      }
      
      if (inCodeBlock) {
        codeBlockContent.push(line);
        return null;
      }
      
      // Headings
      if (line.startsWith('## ')) {
        return <h2 key={index} className="blog-content-h2">{line.substring(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="blog-content-h3">{line.substring(4)}</h3>;
      }
      if (line.startsWith('#### ')) {
        return <h4 key={index} className="blog-content-h4">{line.substring(5)}</h4>;
      }
      
      // Lists
      if (line.trim() === '') {
        return <br key={index} />;
      }
      if (line.match(/^[-*]\s/)) {
        return (
          <li key={index} className="blog-content-li">
            {line.substring(2)}
          </li>
        );
      }
      if (line.match(/^\d+\.\s/)) {
        return (
          <li key={index} className="blog-content-li blog-content-li-numbered">
            {line.replace(/^\d+\.\s/, '')}
          </li>
        );
      }
      
      // Bold text
      if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
        return <p key={index} className="blog-content-strong">{line.substring(2, line.length - 2)}</p>;
      }
      
      // Inline code
      if (line.includes('`')) {
        const parts = line.split('`');
        return (
          <p key={index} className="blog-content-p">
            {parts.map((part, i) => 
              i % 2 === 0 ? part : <code key={i} className="blog-content-code">{part}</code>
            )}
          </p>
        );
      }
      
      return <p key={index} className="blog-content-p">{line}</p>;
    });
  };

  const metaKeywords = `${post.tags.join(', ')}, ${post.category}, Technical Blog, Yogin Parmar`;

  return (
    <div className="App">
      <Helmet>
        <title>{post.title} | Yogin Parmar - Technical Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta name="keywords" content={metaKeywords} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://yoginparmar.dev/blog/${post.slug}`} />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content={post.author} />
        <meta property="article:section" content={post.category} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        {post.images && post.images.length > 0 && (
          <meta name="twitter:image" content={`https://yoginparmar.dev/images/${post.images[0]}`} />
        )}
        {post.images && post.images.length > 0 && (
          <>
            <meta property="og:image" content={`https://yoginparmar.dev/images/${post.images[0]}`} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={post.title} />
          </>
        )}
        <link rel="canonical" href={`https://yoginparmar.dev/blog/${post.slug}`} />
        {post.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "image": post.images && post.images.length > 0 
              ? `https://yoginparmar.dev/images/${post.images[0]}`
              : "https://yoginparmar.dev/og-image.png",
            "datePublished": post.date,
            "dateModified": post.date,
            "author": {
              "@type": "Person",
              "name": post.author,
              "url": "https://yoginparmar.dev"
            },
            "publisher": {
              "@type": "Person",
              "name": "Yogin Parmar",
              "url": "https://yoginparmar.dev"
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://yoginparmar.dev/blog/${post.slug}`
            },
            "keywords": post.tags.join(", "),
            "articleSection": post.category,
            "wordCount": post.content.split(/\s+/).length,
            "timeRequired": post.readTime,
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
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": post.title,
                "item": `https://yoginparmar.dev/blog/${post.slug}`
              }
            ]
          })}
        </script>
      </Helmet>
      <Background />
      <Navigation />
      <main className="blog-post-page">
        <article className="blog-post-article">
          <div className="container">
            <Link to="/blog" className="back-link">
              <ArrowLeft size={20} />
              Back to Blog
            </Link>

            <header className="blog-post-header">
              <div className="blog-post-meta">
                <span className="blog-post-category">{post.category}</span>
                <div className="blog-post-dates">
                  <span className="blog-post-date">
                    <Calendar size={14} />
                    {new Date(post.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                  <span className="blog-post-read-time">
                    <Clock size={14} />
                    {post.readTime}
                  </span>
                </div>
              </div>
              
              <h1 className="blog-post-title">{post.title}</h1>
              <p className="blog-post-excerpt">{post.excerpt}</p>
              
              <div className="blog-post-tags">
                {post.tags.map(tag => (
                  <span key={tag} className="blog-post-tag">{tag}</span>
                ))}
              </div>
            </header>

            <div className="blog-post-content">
              {post.images && post.images.length > 0 && (
                <div className="blog-post-featured-image">
                  <img 
                    src={post.images[0].startsWith('http') ? post.images[0] : `/images/${post.images[0]}`}
                    alt={post.title}
                    loading="eager"
                  />
                </div>
              )}
              {formatContent(post.content)}
            </div>

            <footer className="blog-post-footer">
              <div className="blog-post-author">
                <strong>Author:</strong> {post.author}
              </div>
              <button 
                className="blog-post-share"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: post.title,
                      text: post.excerpt,
                      url: window.location.href
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }
                }}
              >
                <Share2 size={18} />
                Share Article
              </button>
            </footer>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;

