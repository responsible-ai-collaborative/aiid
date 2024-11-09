import React, { useEffect } from 'react';
import { PrismicRichText } from '@prismicio/react';
import { Link } from 'gatsby';
import { Trans } from 'react-i18next';
import config from '../../../config';
import { useLayoutContext } from 'contexts/LayoutContext';
import PrismicOutline from 'components/PrismicOutline';
import Leaderboards from 'components/landing/Leaderboards';
import Sponsors from 'components/landing/Sponsors';
import TranslationBadge from 'components/i18n/TranslationBadge';
import { extractHeaders } from 'utils/extractHeaders';
import { Heading1, Heading2 } from 'components/CustomHeaders';
import { RichText } from 'prismic-reactjs';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';

const PrismicDocPost = ({ doc, location }) => {
  let headers = [];

  const extractedHeaders = extractHeaders(doc.data.content);

  headers = extractedHeaders;

  // Define custom components for Prismic Rich Text
  const components = {
    heading1: ({ children }) => <Heading1>{children}</Heading1>,
    heading2: ({ children }) => <Heading2>{children}</Heading2>,
    Leaderboards: <Leaderboards />,
    Sponsors: <Sponsors />,
  };

  const canonicalUrl = config.gatsby.siteUrl + location.pathname;

  const loc = new URL(canonicalUrl);

  const rightSidebar = (
    <>
      <PrismicOutline location={loc} tableOfContents={headers} />
    </>
  );

  const { displayRightSidebar } = useLayoutContext();

  useEffect(() => {
    displayRightSidebar(rightSidebar);
  }, []);

  return (
    <>
      <div className="titleWrapper">
        <h1>{doc.data.title}</h1>
      </div>
      <div className="flex items-center mb-6 -mt-1 flex-wrap">
        {doc.data.aitranslated && (
          <>
            <TranslationBadge className="ml-2" />
            <Link className="ml-2" to={doc.data.slug}>
              <Trans>View Original</Trans>
            </Link>
          </>
        )}
      </div>
      {doc.data.content.map((content, index) => (
        <>
          {content.markdown?.richText.length > 0 && (
            <div className="prose">
              {(() => {
                const rawMarkdown = RichText.asText(content.markdown.richText);

                return (
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
                    {rawMarkdown}
                  </ReactMarkdown>
                );
              })()}
            </div>
          )}
          {content.text && (
            <div className="prose">
              <PrismicRichText key={index} field={content.text.richText} components={components} />
            </div>
          )}
          {content.component && <div className="mt-4">{components[content.component]}</div>}
        </>
      ))}
    </>
  );
};

export default PrismicDocPost;
