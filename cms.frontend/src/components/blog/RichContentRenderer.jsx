import React, { useMemo, useEffect } from "react";
import DOMPurify from "dompurify";

// Create and inject styles once
const injectStyles = () => {
  if (document.getElementById("rich-content-renderer-styles")) {
    return;
  }

  const styleElement = document.createElement("style");
  styleElement.id = "rich-content-renderer-styles";
  styleElement.textContent = `
    .rich-content-renderer h1 {
      font-size: 2.25rem;
      font-weight: 900;
      margin-top: 1.5rem;
      margin-bottom: 1rem;
      line-height: 1.2;
      letter-spacing: -0.02em;
      color: rgb(23, 23, 23);
    }
    
    .rich-content-renderer h2 {
      font-size: 1.875rem;
      font-weight: 900;
      margin-top: 1.5rem;
      margin-bottom: 0.875rem;
      line-height: 1.2;
      letter-spacing: -0.01em;
      color: rgb(23, 23, 23);
    }
    
    .rich-content-renderer h3 {
      font-size: 1.5rem;
      font-weight: 800;
      margin-top: 1.25rem;
      margin-bottom: 0.75rem;
      line-height: 1.25;
      color: rgb(23, 23, 23);
    }
    
    .rich-content-renderer h4 {
      font-size: 1.25rem;
      font-weight: 700;
      margin-top: 1rem;
      margin-bottom: 0.625rem;
      color: rgb(23, 23, 23);
    }
    
    .rich-content-renderer h5 {
      font-size: 1.125rem;
      font-weight: 700;
      margin-top: 0.875rem;
      margin-bottom: 0.5rem;
      color: rgb(23, 23, 23);
    }
    
    .rich-content-renderer h6 {
      font-size: 1rem;
      font-weight: 700;
      margin-top: 0.75rem;
      margin-bottom: 0.5rem;
      color: rgb(23, 23, 23);
    }
    
    .rich-content-renderer p {
      margin-bottom: 1.25rem;
      line-height: 1.75;
      color: rgb(64, 64, 64);
    }
    
    .rich-content-renderer strong {
      font-weight: 700;
      color: rgb(23, 23, 23);
    }
    
    .rich-content-renderer em {
      font-style: italic;
    }
    
    .rich-content-renderer u {
      text-decoration: underline;
      text-decoration-thickness: 1px;
      text-underline-offset: 0.15em;
    }
    
    .rich-content-renderer a {
      color: rgb(23, 23, 23);
      text-decoration: underline;
      text-decoration-thickness: 1px;
      text-underline-offset: 0.25em;
      transition: color 0.2s ease;
      font-weight: 500;
    }
    
    .rich-content-renderer a:hover {
      color: rgb(120, 113, 108);
      text-decoration-color: rgb(120, 113, 108);
    }
    
    .rich-content-renderer ul {
      list-style-type: disc;
      padding-left: 1.5rem;
      margin-bottom: 1.25rem;
    }
    
    .rich-content-renderer ol {
      list-style-type: decimal;
      padding-left: 1.5rem;
      margin-bottom: 1.25rem;
    }
    
    .rich-content-renderer li {
      margin-bottom: 0.5rem;
      line-height: 1.75;
    }
    
    .rich-content-renderer ul ul,
    .rich-content-renderer ul ol,
    .rich-content-renderer ol ul,
    .rich-content-renderer ol ol {
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
      padding-left: 1.5rem;
    }
    
    .rich-content-renderer blockquote {
      border-left: 4px solid rgb(200, 200, 200);
      padding-left: 1.5rem;
      margin-left: 0;
      margin-bottom: 1.25rem;
      font-style: italic;
      color: rgb(102, 102, 102);
    }
    
    .rich-content-renderer blockquote p {
      margin-bottom: 0;
    }
    
    .rich-content-renderer table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 1.25rem;
    }
    
    .rich-content-renderer table th,
    .rich-content-renderer table td {
      border: 1px solid rgb(229, 229, 229);
      padding: 0.75rem;
      text-align: left;
    }
    
    .rich-content-renderer table th {
      background-color: rgb(245, 245, 245);
      font-weight: 700;
      color: rgb(23, 23, 23);
    }
    
    .rich-content-renderer table tr:hover {
      background-color: rgb(250, 250, 250);
    }
    
    .rich-content-renderer img {
      max-width: 100%;
      height: auto;
      margin-bottom: 1.25rem;
      margin-top: 1.25rem;
      border-radius: 4px;
    }
    
    .rich-content-renderer figure {
      margin-bottom: 1.25rem;
    }
    
    .rich-content-renderer figcaption {
      text-align: center;
      font-size: 0.875rem;
      color: rgb(120, 120, 120);
      margin-top: 0.5rem;
    }
    
    .rich-content-renderer pre {
      background-color: rgb(245, 245, 245);
      border: 1px solid rgb(229, 229, 229);
      border-radius: 4px;
      padding: 1rem;
      overflow-x: auto;
      margin-bottom: 1.25rem;
    }
    
    .rich-content-renderer code {
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Courier New', monospace;
      font-size: 0.875em;
      background-color: rgb(245, 245, 245);
      padding: 0.2em 0.4em;
      border-radius: 3px;
      color: rgb(199, 29, 29);
    }
    
    .rich-content-renderer pre code {
      background-color: transparent;
      padding: 0;
      color: rgb(64, 64, 64);
    }
    
    .rich-content-renderer hr {
      border: none;
      border-top: 1px solid rgb(229, 229, 229);
      margin-top: 2rem;
      margin-bottom: 2rem;
    }
  `;

  document.head.appendChild(styleElement);
};

export const RichContentRenderer = ({ content }) => {
  const sanitizedHTML = useMemo(() => {
    if (!content) return "";

    const config = {
      ALLOWED_TAGS: [
        "p",
        "br",
        "strong",
        "em",
        "u",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "ul",
        "ol",
        "li",
        "blockquote",
        "a",
        "img",
        "table",
        "thead",
        "tbody",
        "tfoot",
        "tr",
        "td",
        "th",
        "pre",
        "code",
        "hr",
        "figure",
        "figcaption",
      ],
      ALLOWED_ATTR: [
        "href",
        "title",
        "target",
        "rel",
        "src",
        "alt",
        "width",
        "height",
        "style",
        "class",
        "colspan",
        "rowspan",
      ],
      ALLOW_DATA_ATTR: false,
    };

    return DOMPurify.sanitize(content, config);
  }, [content]);

  useEffect(() => {
    injectStyles();
  }, []);

  return (
    <div
      className="rich-content-renderer max-w-none text-neutral-700 leading-relaxed text-sm sm:text-base"
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  );
};

export default RichContentRenderer;
