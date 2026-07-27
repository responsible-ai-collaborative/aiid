import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeTruncate from 'rehype-truncate';
import Link from '../ui/Link';
import { Trans } from 'react-i18next';

/**
 * @param {string} text -
 *     The body text of the report
 *
 * @param {number} maxUiChars -
 *     The maximum number of characters to show
 *     when the text is not expanded to be read in full
 *
 * @param {number} maxQuotationChars -
 *     The maximum number of characters to show under any circumstance,
 *     beyond which we direct the user to the original source
 *
 * @param {number} continueLink -
 *     The link to the source text to show if maxQuotationChars is reached
 */
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
      {/* react-markdown v9 removed the className prop; wrap to keep the same classes */}
      <div className="react-markdown prose max-w-full">
        <ReactMarkdown rehypePlugins={rehypePlugins}>{text}</ReactMarkdown>
      </div>
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
