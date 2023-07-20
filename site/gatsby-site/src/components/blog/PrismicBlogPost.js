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
import Outline from 'components/Outline';
import AiidHelmet from 'components/AiidHelmet';

const PrismicBlogPost = ({ post, location }) => {
  const metaTitle = post.data.metaTitle;

  const metaDescription = post.data.metaDescription;

  const postImage = post.data.image?.gatsbyImageData?.images?.fallback?.src;

  let metaImage = null;

  if (postImage) {
    metaImage = `${config.gatsby.siteUrl}${postImage}`;
  }

  const canonicalUrl = config.gatsby.siteUrl + location.pathname;

  const loc = new URL(canonicalUrl);

  const rightSidebar = (
    <>
      <Outline location={loc} />
    </>
  );

  const { displayRightSidebar } = useLayoutContext();

  useEffect(() => {
    displayRightSidebar(rightSidebar);
  }, []);

  return (
    <>
      <AiidHelmet {...{ metaTitle, metaDescription, path: location.pathname, metaImage }} />
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
        <PrismicRichText field={post.data.content.richText} />
      </div>
    </>
  );
};

var Author = ({ name }) => <span>{name}</span>;

export default PrismicBlogPost;
