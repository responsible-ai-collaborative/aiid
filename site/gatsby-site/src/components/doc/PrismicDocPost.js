import React, { useEffect, useState } from 'react';
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
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
} from 'components/CustomHeaders';

const PrismicDocPost = ({ doc, location }) => {
  const [headers, setHeaders] = useState([]);

  useEffect(() => {
    const extractedHeaders = extractHeaders(doc.data.content);

    setHeaders(extractedHeaders);
  }, [doc.data.content]);

  // Define custom components for Prismic Rich Text
  const components = {
    heading1: ({ children }) => <Heading1>{children}</Heading1>,
    heading2: ({ children }) => <Heading2>{children}</Heading2>,
    heading3: ({ children }) => <Heading3>{children}</Heading3>,
    heading4: ({ children }) => <Heading4>{children}</Heading4>,
    heading5: ({ children }) => <Heading5>{children}</Heading5>,
    heading6: ({ children }) => <Heading6>{children}</Heading6>,
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
  }, [headers]);

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
