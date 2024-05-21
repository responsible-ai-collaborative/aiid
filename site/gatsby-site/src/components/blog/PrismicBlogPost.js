import { PrismicRichText } from '@prismicio/react';
import TranslationBadge from 'components/i18n/TranslationBadge';
import DateLabel from 'components/ui/DateLabel';
import { Link } from 'gatsby';
import SocialShareButtons from 'components/ui/SocialShareButtons';
import { LocalizedLink } from 'plugins/gatsby-theme-i18n';
import React, { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import config from '../../../config';
import { useLayoutContext } from 'contexts/LayoutContext';
import PrismicOutline from 'components/PrismicOutline';
import { extractHeaders } from 'utils/extractHeaders';
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
} from 'components/CustomHeaders';

const PrismicBlogPost = ({ post, location }) => {
  const [headers, setHeaders] = useState([]);

  useEffect(() => {
    const extractedHeaders = extractHeaders(post.data.content);

    setHeaders(extractedHeaders);
  }, [post.data.content]);

  const components = {
    heading1: ({ children }) => <Heading1>{children}</Heading1>,
    heading2: ({ children }) => <Heading2>{children}</Heading2>,
    heading3: ({ children }) => <Heading3>{children}</Heading3>,
    heading4: ({ children }) => <Heading4>{children}</Heading4>,
    heading5: ({ children }) => <Heading5>{children}</Heading5>,
    heading6: ({ children }) => <Heading6>{children}</Heading6>,
  };

  const metaTitle = post.data.metatitle;

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
      <div className={'titleWrapper'}>
        <LocalizedLink to="/blog" className="text-lg">
          <Trans>AIID Blog</Trans>
        </LocalizedLink>
        <h1>{post.data.title.text}</h1>
      </div>
      <div className="flex items-center mb-6 -mt-1 flex-wrap">
        <SocialShareButtons
          metaTitle={metaTitle}
          path={location.pathname}
          page="post"
          className="inline-block"
        />
        {post.data.aitranslated && (
          <>
            <TranslationBadge className="ml-2" />
            <Link className="ml-2" to={post.data.slug}>
              <Trans>View Original</Trans>
            </Link>
          </>
        )}
        <span>
          {' '}
          <Trans>
            Posted <DateLabel date={new Date(post.data.date)} /> by{' '}
            <Author name={post.data.author} />.
          </Trans>
        </span>
      </div>
      <div className="prose">
        <PrismicRichText field={post.data.content.richText} components={components} />
      </div>
    </>
  );
};

var Author = ({ name }) => <span>{name}</span>;

export default PrismicBlogPost;
