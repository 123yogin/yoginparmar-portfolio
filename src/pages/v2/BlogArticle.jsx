import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import blogData from '../../data/blog.json';
import { Footer, NavBar, Pv2Page } from './Chrome';
import { parseMarkdown } from './markdown';
import './portfolio-v2.css';
import './blog.css';

const BASE = 'https://yoginparmar.dev';

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const imageUrl = (src) => (src.startsWith('http') ? src : `${BASE}/images/${src}`);

function NotFound() {
  return (
    <Pv2Page>
      <Helmet>
        <title>Article not found | Yogin Parmar</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <NavBar />
      <main className="pv2-blog-main">
        <div className="pv2-side pv2-notfound">
          <div className="pv2-kicker">404</div>
          <h1>That article doesn&apos;t exist.</h1>
          <p>The link may be out of date, or the post was renamed. Everything published is on the writing index.</p>
          <Link to="/blog" className="pv2-btn-index">
            Back to writing <span>→</span>
          </Link>
        </div>
      </main>
      <Footer />
    </Pv2Page>
  );
}

export default function BlogArticle() {
  const { slug } = useParams();
  const posts = [...blogData].sort((a, b) => new Date(b.date) - new Date(a.date));
  const index = posts.findIndex((p) => p.slug === slug);

  if (index < 0) return <NotFound />;

  /* keyed on slug so per-article state (share button) resets on navigation */
  return <Article key={slug} post={posts[index]} next={posts[(index + 1) % posts.length]} />;
}

function Article({ post, next }) {
  const [copied, setCopied] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const { blocks, toc } = useMemo(() => parseMarkdown(post.content), [post.content]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* highlight the section currently under the nav in the contents rail */
  useEffect(() => {
    if (!toc.length) return undefined;
    const targets = toc
      .map((t) => document.getElementById(t.id))
      .filter(Boolean);
    if (!targets.length) return undefined;

    const seen = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e));
        const visible = [...seen.values()]
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-96px 0px -70% 0px' }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [toc]);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, text: post.excerpt, url });
        return;
      } catch {
        /* dismissed — fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked; nothing useful to do */
    }
  };

  const hero = post.images?.length ? post.images[0] : null;

  return (
    <Pv2Page>
      <Helmet>
        <title>{`${post.title} | Yogin Parmar`}</title>
        <meta name="description" content={post.excerpt} />
        <meta
          name="keywords"
          content={`${post.tags.join(', ')}, ${post.category}, Technical Blog, Yogin Parmar`}
        />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${BASE}/blog/${post.slug}`} />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content={post.author} />
        <meta property="article:section" content={post.category} />
        {post.tags.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        {hero ? <meta name="twitter:image" content={imageUrl(hero)} /> : null}
        {hero ? <meta property="og:image" content={imageUrl(hero)} /> : null}
        {hero ? <meta property="og:image:width" content="1200" /> : null}
        {hero ? <meta property="og:image:height" content="630" /> : null}
        {hero ? <meta property="og:image:alt" content={post.title} /> : null}
        <link rel="canonical" href={`${BASE}/blog/${post.slug}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            image: hero ? imageUrl(hero) : `${BASE}/og-image.png`,
            datePublished: post.date,
            dateModified: post.date,
            author: { '@type': 'Person', name: post.author, url: BASE },
            publisher: { '@type': 'Person', name: 'Yogin Parmar', url: BASE },
            mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE}/blog/${post.slug}` },
            keywords: post.tags.join(', '),
            articleSection: post.category,
            wordCount: post.content.split(/\s+/).length,
            timeRequired: post.readTime,
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
              {
                '@type': 'ListItem',
                position: 3,
                name: post.title,
                item: `${BASE}/blog/${post.slug}`,
              },
            ],
          })}
        </script>
      </Helmet>

      <NavBar />

      <main className="pv2-blog-main">
        <article className="pv2-side">
          <div className="pv2-article-shell">
          <Link to="/blog" className="pv2-back">
            <span aria-hidden="true">←</span> All writing
          </Link>

          <header className="pv2-article-header">
            <div className="pv2-article-kicker">
              <span>{post.category}</span>
              <span className="sep" aria-hidden="true">/</span>
              <span className="meta">{formatDate(post.date)}</span>
              <span className="sep" aria-hidden="true">/</span>
              <span className="meta">{post.readTime}</span>
            </div>
            <h1>{post.title}</h1>
            <p className="pv2-article-excerpt">{post.excerpt}</p>
            <div className="pv2-article-tags">
              {post.tags.map((tag) => (
                <span key={tag} className="pv2-tag">{tag}</span>
              ))}
            </div>
          </header>

          <div className="pv2-article-layout">
            <div className="pv2-article-col">
              <div className="pv2-article-body">
                {hero ? (
                  <figure className="pv2-article-hero">
                    <img
                      src={hero.startsWith('http') ? hero : `/images/${hero}`}
                      alt={post.title}
                      loading="eager"
                    />
                  </figure>
                ) : null}
                {blocks}
              </div>

              <footer className="pv2-article-footer">
                <span className="pv2-article-author">
                  Written by <strong>{post.author}</strong>
                </span>
                <button
                  type="button"
                  className={`pv2-share${copied ? ' is-copied' : ''}`}
                  onClick={share}
                >
                  {copied ? 'Link copied ✓' : 'Share article ↗'}
                </button>
              </footer>
            </div>

            <aside className="pv2-rail" aria-label="Article details">
              <div className="pv2-rail-sticky">
                {toc.length > 1 ? (
                  <nav className="pv2-toc" aria-label="Table of contents">
                    <div className="pv2-rail-label">In this article</div>
                    <ol>
                      {toc.map((item) => (
                        <li key={item.id}>
                          <a
                            href={`#${item.id}`}
                            className={activeId === item.id ? 'is-active' : undefined}
                            aria-current={activeId === item.id ? 'true' : undefined}
                          >
                            {item.text}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                ) : null}

                <div className="pv2-rail-block">
                  <div className="pv2-rail-label">Filed under</div>
                  <div className="pv2-rail-value">{post.category}</div>
                </div>
              </div>
            </aside>
          </div>

          {next && next.slug !== post.slug ? (
            <nav className="pv2-article-next" aria-label="Next article">
              <Link to={`/blog/${next.slug}`} className="pv2-next-row">
                <span className="pv2-next-label">Read next</span>
                <span className="pv2-next-title">{next.title}</span>
                <span className="pv2-post-arrow">→</span>
              </Link>
            </nav>
          ) : null}
          </div>
        </article>
      </main>

      <Footer />
    </Pv2Page>
  );
}
