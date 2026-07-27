import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import blogData from '../../data/blog.json';
import { Footer, NavBar, Pv2Page } from './Chrome';
import { Reveal } from './lib';
import './portfolio-v2.css';
import './blog.css';

const BASE = 'https://yoginparmar.dev';

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

export default function BlogIndex() {
  const posts = [...blogData].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <Pv2Page>
      <Helmet>
        <title>Writing — Backend, databases & architecture | Yogin Parmar</title>
        <meta
          name="description"
          content="Deep-dive technical articles on backend development, database design, and production-grade architecture decisions — written from real implementations."
        />
        <meta
          name="keywords"
          content="Technical Blog, Backend Development, Database Design, Spring Boot, FastAPI, PostgreSQL, Python, Architecture, Case Studies, Yogin Parmar"
        />
        <meta property="og:title" content="Writing — Backend, databases & architecture | Yogin Parmar" />
        <meta
          property="og:description"
          content="Deep-dive technical articles on backend development, database design, and production-grade architecture decisions."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${BASE}/blog`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Writing — Backend, databases & architecture" />
        <meta
          name="twitter:description"
          content="Deep-dive technical articles on backend development and architecture."
        />
        <link rel="canonical" href={`${BASE}/blog`} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Writing — Backend, databases & architecture',
            description:
              'Deep-dive technical articles on backend development, database design, and production-grade architecture decisions.',
            url: `${BASE}/blog`,
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: posts.length,
              itemListElement: posts.map((post, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                  '@type': 'BlogPosting',
                  headline: post.title,
                  url: `${BASE}/blog/${post.slug}`,
                  datePublished: post.date,
                },
              })),
            },
            inLanguage: 'en-US',
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
              { '@type': 'ListItem', position: 2, name: 'Writing', item: `${BASE}/blog` },
            ],
          })}
        </script>
      </Helmet>

      <NavBar />

      <main className="pv2-blog-main">
        <div className="pv2-side">
          <Reveal as="header" className="pv2-blog-masthead">
            <div className="pv2-kicker">Writing</div>
            <h1>Notes from the back end</h1>
            <p className="pv2-blog-lede">
              Deep dives on backend development, database design, and the architecture decisions
              that only show up once something is running in production.
            </p>
          </Reveal>

          <div>
            {posts.map((post, i) => (
              <Link key={post.id ?? post.slug} to={`/blog/${post.slug}`} className="pv2-post-row">
                <span className="pv2-post-num">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <span className="pv2-post-title">{post.title}</span>
                  <span className="pv2-post-excerpt">{post.excerpt}</span>
                  <span className="pv2-tags">
                    {post.tags.slice(0, 5).map((tag) => (
                      <span key={tag} className="pv2-tag">{tag}</span>
                    ))}
                  </span>
                </span>
                <span className="pv2-post-side">
                  <span className="pv2-post-category">{post.category}</span>
                  <span className="pv2-post-meta">
                    {formatDate(post.date)}
                    <br />
                    {post.readTime}
                  </span>
                </span>
                <span className="pv2-post-arrow">→</span>
              </Link>
            ))}
          </div>

          <div className="pv2-blog-outro">
            <span>Code for most of these lives on GitHub.</span>
            <a
              className="pv2-btn-index"
              href="https://github.com/123yogin"
              target="_blank"
              rel="noopener noreferrer"
            >
              Browse the index <span>→</span>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </Pv2Page>
  );
}
