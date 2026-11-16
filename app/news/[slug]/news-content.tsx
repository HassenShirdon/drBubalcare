import type { ReactNode } from 'react';

type TiptapMark = {
  type: string;
  attrs?: Record<string, unknown> | null;
};

type TiptapNode = {
  type: string;
  attrs?: Record<string, unknown> | null;
  content?: TiptapNode[];
  text?: string;
  marks?: TiptapMark[];
};

function safeUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const url = value.trim();
  if (!url) return null;
  if (/^(https?:|mailto:|tel:)/i.test(url)) return url;
  if (/^(\/|#|\.\/|\.\.\/)/.test(url)) return url;
  return null;
}

function renderMarks(
  text: ReactNode,
  marks: TiptapMark[] | undefined,
  key: string
): ReactNode {
  if (!marks || marks.length === 0) return text;

  return marks.reduce<ReactNode>((acc, mark, index) => {
    const markKey = `${key}-mark-${index}`;
    switch (mark.type) {
      case 'bold':
        return <strong key={markKey}>{acc}</strong>;
      case 'italic':
        return <em key={markKey}>{acc}</em>;
      case 'strike':
        return <s key={markKey}>{acc}</s>;
      case 'underline':
        return <u key={markKey}>{acc}</u>;
      case 'code':
        return <code key={markKey}>{acc}</code>;
      case 'link': {
        const href = safeUrl(mark.attrs?.href);
        if (!href) return acc;
        const target =
          typeof mark.attrs?.target === 'string' ? mark.attrs.target : '_blank';
        const rel =
          typeof mark.attrs?.rel === 'string'
            ? mark.attrs.rel
            : 'noopener noreferrer nofollow';
        return (
          <a key={markKey} href={href} target={target} rel={rel}>
            {acc}
          </a>
        );
      }
      default:
        return acc;
    }
  }, text);
}

function renderNodes(
  nodes: TiptapNode[] | undefined,
  keyPrefix: string
): ReactNode {
  if (!nodes || nodes.length === 0) return null;
  return nodes.map((node, index) =>
    renderNode(node, `${keyPrefix}-${index}`)
  );
}

function renderNode(node: TiptapNode, key: string): ReactNode {
  switch (node.type) {
    case 'text':
      return renderMarks(node.text ?? '', node.marks, key);

    case 'paragraph':
      return <p key={key}>{renderNodes(node.content, key)}</p>;

    case 'heading': {
      const rawLevel = node.attrs?.level;
      const level =
        typeof rawLevel === 'number' && rawLevel >= 1 && rawLevel <= 6
          ? rawLevel
          : 2;
      const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      return <Tag key={key}>{renderNodes(node.content, key)}</Tag>;
    }

    case 'bulletList':
      return <ul key={key}>{renderNodes(node.content, key)}</ul>;

    case 'orderedList': {
      const rawStart = node.attrs?.start;
      const start = typeof rawStart === 'number' ? rawStart : undefined;
      return (
        <ol key={key} start={start}>
          {renderNodes(node.content, key)}
        </ol>
      );
    }

    case 'listItem':
      return <li key={key}>{renderNodes(node.content, key)}</li>;

    case 'blockquote':
      return <blockquote key={key}>{renderNodes(node.content, key)}</blockquote>;

    case 'codeBlock': {
      const rawLanguage = node.attrs?.language;
      const language =
        typeof rawLanguage === 'string' && rawLanguage.length > 0
          ? rawLanguage
          : undefined;
      return (
        <pre key={key}>
          <code className={language ? `language-${language}` : undefined}>
            {renderNodes(node.content, key)}
          </code>
        </pre>
      );
    }

    case 'horizontalRule':
      return <hr key={key} />;

    case 'hardBreak':
      return <br key={key} />;

    case 'image': {
      const rawSrc = node.attrs?.src;
      const src =
        typeof rawSrc === 'string' && rawSrc.startsWith('data:image/')
          ? rawSrc
          : safeUrl(rawSrc);
      if (!src) return null;
      const rawAlt = node.attrs?.alt;
      const rawTitle = node.attrs?.title;
      return (
        // Content images are arbitrary admin-provided URLs, so use a plain img
        // element rather than next/image (which would require remotePatterns).
        <img
          key={key}
          src={src}
          alt={typeof rawAlt === 'string' ? rawAlt : ''}
          title={typeof rawTitle === 'string' ? rawTitle : undefined}
          loading="lazy"
        />
      );
    }

    case 'doc':
    default:
      return <>{renderNodes(node.content, key)}</>;
  }
}

export function NewsContent({ content }: { content: string }) {
  let doc: TiptapNode | null = null;

  try {
    doc = JSON.parse(content) as TiptapNode;
  } catch {
    doc = null;
  }

  if (!doc || typeof doc !== 'object') return null;

  return <div className="tiptap-content">{renderNode(doc, 'root')}</div>;
}
