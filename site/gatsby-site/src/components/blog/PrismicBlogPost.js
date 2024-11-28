import { PrismicRichText } from '@prismicio/react';
import TranslationBadge from 'components/i18n/TranslationBadge';
import DateLabel from 'components/ui/DateLabel';
import { Link } from 'gatsby';
import SocialShareButtons from 'components/ui/SocialShareButtons';
import { LocalizedLink } from 'plugins/gatsby-theme-i18n';
import React, { useEffect } from 'react';
import { Trans } from 'react-i18next';
import config from '../../../config';
import { useLayoutContext } from 'contexts/LayoutContext';
import PrismicOutline from 'components/PrismicOutline';
import { extractHeaders } from 'utils/extractHeaders';
import { Heading1, Heading2 } from 'components/CustomHeaders';

const PrismicBlogPost = ({ post, location }) => {
  let headers = [];

  const extractedHeaders = extractHeaders(post.data.content);

  headers = extractedHeaders;

  // Define custom components for Prismic Rich Text
  const components = {
    heading1: ({ children }) => <Heading1>{children}</Heading1>,
    heading2: ({ children }) => <Heading2>{children}</Heading2>,
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
  }, []);

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
            <Link className="mx-2" to={`/blog/${post.data.slug}`}>
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
      <div className="prose" data-testid="blog-content">
        <PrismicRichText field={post.data.content.richText} components={components} />
      </div>
    </>
  );
};

var Author = ({ name }) => <span>{name}</span>;

export default PrismicBlogPost;
