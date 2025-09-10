import React from 'react';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

const LatexRenderer = ({ latex }) => {
  if (!latex) return null;

  // Split text into LaTeX and non-LaTeX parts
  const parts = [];
  let lastIndex = 0;
  const regex = /(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$|\\\([\s\S]+?\\\)|\\\[[\s\S]+?\\\])/g;
  let match;
  while ((match = regex.exec(latex)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: latex.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'latex', content: match[0] });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < latex.length) {
    parts.push({ type: 'text', content: latex.slice(lastIndex) });
  }

  return (
    <span className="latex-renderer">
      {parts.map((part, idx) => {
        if (part.type === 'latex') {
          // Remove delimiters for rendering
          const { content } = part;
          if (content.startsWith('$$') && content.endsWith('$$')) {
            return <BlockMath key={idx}>{content.slice(2, -2)}</BlockMath>;
          }
          if (content.startsWith('\\[') && content.endsWith('\\]')) {
            return <BlockMath key={idx}>{content.slice(2, -2)}</BlockMath>;
          }
          if (content.startsWith('$') && content.endsWith('$')) {
            return <InlineMath key={idx}>{content.slice(1, -1)}</InlineMath>;
          }
          if (content.startsWith('\\(') && content.endsWith('\\)')) {
            return <InlineMath key={idx}>{content.slice(2, -2)}</InlineMath>;
          }
          // fallback
          return <span key={idx}>{content}</span>;
        }
        // Just render text as is
        return <span key={idx}>{part.content}</span>;
      })}
    </span>
  );
};

export default LatexRenderer;

