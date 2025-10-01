import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import 'katex/dist/katex.min.css';
import './MarkdownWithMath.css';

const MarkdownWithMath = ({ content }) => {
  return (
    <ReactMarkdown
      children={content}
      remarkPlugins={[remarkMath, remarkGfm]}
      rehypePlugins={[rehypeKatex]}
      components={{
        table: ({ node, ...props }) => <table className="markdown-table" {...props} />
      }}
    />
  );
};

export default MarkdownWithMath;
