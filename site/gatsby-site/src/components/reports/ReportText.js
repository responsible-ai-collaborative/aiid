import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeTruncate from 'rehype-truncate';

function ReportText({ text, maxChars = null }) {
  const rehypePlugins = [];

  if (maxChars) {
    rehypePlugins.push([rehypeTruncate, { maxChars }]);
  }

  return <ReactMarkdown rehypePlugins={rehypePlugins}>{text.replace(/\n/g, '\n\n')}</ReactMarkdown>;
}

export default ReportText;
