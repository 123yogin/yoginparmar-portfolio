/* Minimal markdown renderer for blog content.
   Blocks: headings, fenced code, bullet/numbered lists, images, paragraphs.
   Inline: **bold**, `code`, [text](href). */

const INLINE = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;

function renderInline(text, keyPrefix) {
  const parts = text.split(INLINE).filter((p) => p !== '' && p !== undefined);
  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return <code key={key} className="pv2-md-code">{part.slice(1, -1)}</code>;
    }
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) {
      const [, label, href] = link;
      const external = /^https?:/.test(href);
      return (
        <a key={key} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {label}
        </a>
      );
    }
    return part;
  });
}

const imageSrc = (src) => (src.startsWith('http') ? src : `/images/${src}`);

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/`|\*\*/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/* Returns the rendered blocks plus a table of contents built from the
   top-level headings, so the article can offer an "in this article" rail. */
export function parseMarkdown(content) {
  const lines = content.split('\n');
  const blocks = [];
  const toc = [];
  const usedIds = new Set();
  let list = null; // { ordered, items: [] }

  const flushList = () => {
    if (!list) return;
    const key = `list-${blocks.length}`;
    const items = list.items.map((item, i) => (
      <li key={`${key}-${i}`}>{renderInline(item, `${key}-${i}`)}</li>
    ));
    blocks.push(
      list.ordered
        ? <ol key={key} className="pv2-md-ol">{items}</ol>
        : <ul key={key} className="pv2-md-ul">{items}</ul>
    );
    list = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const key = `b-${i}`;

    // fenced code — consume through the closing fence
    if (line.startsWith('```')) {
      flushList();
      const lang = line.slice(3).trim();
      const body = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        body.push(lines[i]);
        i++;
      }
      blocks.push(
        <pre key={key} className="pv2-md-pre" data-lang={lang || undefined}>
          <code>{body.join('\n')}</code>
        </pre>
      );
      continue;
    }

    const image = /^!\[(.*?)\]\((.*?)\)\s*$/.exec(line);
    if (image) {
      flushList();
      const [, alt, src] = image;
      blocks.push(
        <figure key={key} className="pv2-md-figure">
          <img src={imageSrc(src)} alt={alt} loading="lazy" />
          {alt ? <figcaption>{alt}</figcaption> : null}
        </figure>
      );
      continue;
    }

    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      flushList();
      const level = heading[1].length;
      const text = heading[2];
      // article <h1> is the post title, so demote content headings one level
      const Tag = `h${Math.min(level + 1, 5)}`;

      let id = slugify(text) || `section-${blocks.length}`;
      while (usedIds.has(id)) id = `${id}-${blocks.length}`;
      usedIds.add(id);

      // the content mixes `#` and `##` for the same rank — both are top level
      if (level <= 2) toc.push({ id, text: text.replace(/`|\*\*/g, '') });

      blocks.push(
        <Tag key={key} id={id} className={`pv2-md-h${level}`}>
          {renderInline(text, key)}
        </Tag>
      );
      continue;
    }

    const bullet = /^[-*]\s+(.*)$/.exec(line);
    if (bullet) {
      if (!list || list.ordered) { flushList(); list = { ordered: false, items: [] }; }
      list.items.push(bullet[1]);
      continue;
    }

    const numbered = /^\d+\.\s+(.*)$/.exec(line);
    if (numbered) {
      if (!list || !list.ordered) { flushList(); list = { ordered: true, items: [] }; }
      list.items.push(numbered[1]);
      continue;
    }

    if (line.trim() === '') {
      flushList();
      continue;
    }

    if (/^([-*_])\1{2,}\s*$/.test(line.trim())) {
      flushList();
      blocks.push(<hr key={key} className="pv2-md-hr" />);
      continue;
    }

    flushList();
    blocks.push(<p key={key} className="pv2-md-p">{renderInline(line, key)}</p>);
  }

  flushList();
  return { blocks, toc };
}
