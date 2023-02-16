import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeTruncate from 'rehype-truncate';

function ReportText({ text, maxChars = null }) {
  const rehypePlugins = [];

  if (maxChars) {
    rehypePlugins.push([rehypeTruncate, { maxChars }]);
  }

  return (
    <ReactMarkdown rehypePlugins={rehypePlugins} className="prose max-w-full">
      {text}
    </ReactMarkdown>
  );
}

export default ReportText;
