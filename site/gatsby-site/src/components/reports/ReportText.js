import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeTruncate from 'rehype-truncate';
import Link from '../ui/Link';
import { Trans } from 'react-i18next';

function ReportText({ text, maxUiChars = null, maxQuotationChars = null, continueLink = null }) {
  const rehypePlugins = [];

  let maxChars = null;

  if (maxUiChars && maxQuotationChars) {
    maxChars = Math.min(maxUiChars, maxQuotationChars);
  } else if (maxUiChars) {
    maxChars = maxUiChars;
  } else if (maxQuotationChars) {
    maxChars = maxQuotationChars;
  }

  if (maxChars) {
    rehypePlugins.push([rehypeTruncate, { maxChars }]);
  }

  const isLimitedByUiChars = maxUiChars && maxUiChars < text.length;

  const isLimitedByQuotationChars = maxQuotationChars && maxQuotationChars < text.length;

  const displayContinueLink = continueLink && !isLimitedByUiChars && isLimitedByQuotationChars;

  return (
    <>
      <ReactMarkdown rehypePlugins={rehypePlugins} className="react-markdown prose max-w-full">
        {text}
      </ReactMarkdown>
      {displayContinueLink && (
        <p className="mt-4">
          <Trans>
            Continue reading at <Link to={continueLink}>the source</Link>.
          </Trans>
        </p>
      )}
    </>
  );
}

export default ReportText;
