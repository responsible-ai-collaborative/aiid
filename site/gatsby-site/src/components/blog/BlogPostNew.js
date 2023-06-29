import { PrismicRichText } from '@prismicio/react';
// import TranslationBadge from 'components/i18n/TranslationBadge';
import DateLabel from 'components/ui/DateLabel';
// import SocialShareButtons from 'components/ui/SocialShareButtons';
// import { useLayoutContext } from 'contexts/LayoutContext';
// import { Link } from 'gatsby';
import { LocalizedLink } from 'plugins/gatsby-theme-i18n';
import React from 'react';
import { Trans } from 'react-i18next';
// import config from '../../../config';
// import Outline from 'components/Outline';

const BlogPostNew = ({ post }) => {
  // const metaTitle = mdx.frontmatter.metaTitle;

  // const metaDescription = mdx.frontmatter.metaDescription;

  // const postImage = mdx.frontmatter.image?.childImageSharp?.gatsbyImageData?.images?.fallback?.src;

  // let metaImage = null;

  // if (postImage) {
  //   metaImage = `${config.gatsby.siteUrl}${postImage}`;
  // }

  // const canonicalUrl = config.gatsby.siteUrl + props.location.pathname;

  // const loc = new URL(canonicalUrl);

  // const rightSidebar = (
  //   <>
  //     <Outline location={loc} />
  //   </>
  // );

  // const { displayRightSidebar } = useLayoutContext();

  // useEffect(() => {
  //   displayRightSidebar(rightSidebar);
  // }, []);

  return (
    <>
      {/* <AiidHelmet {...{ metaTitle, metaDescription, path: props.location.pathname, metaImage }} /> */}
      <div className={'titleWrapper'}>
        <LocalizedLink to="/blog" className="text-lg">
          <Trans>AIID Blog</Trans>
        </LocalizedLink>
        <h1>{post.data.title.text}</h1>
      </div>
      <div className="flex items-center mb-6 -mt-1 flex-wrap">
        {/* <SocialShareButtons
          metaTitle={metaTitle}
          path={props.location.pathname}
          page="post"
          className="inline-block"
        /> */}
        {/* {mdx.frontmatter.aiTranslated && (
          <>
            <TranslationBadge className="ml-2" />
            <Link className="ml-2" to={mdx.frontmatter.slug}>
              <Trans>View Original</Trans>
            </Link>
          </>
        )} */}
        <span>
          {' '}
          <Trans>
            Posted <DateLabel date={new Date(post.data.date)} /> by{' '}
            <Author name={post.data.author} />.
          </Trans>
        </span>
      </div>
      {/* <div className={`prose post-styled-main-wrapper`}>
        <MDXProvider components={MdxComponents}>{children}</MDXProvider>
      </div> */}
      <PrismicRichText field={post.data.content.richText} />
    </>
  );
};

var Author = ({ name }) => <span>{name}</span>;

export default BlogPostNew;
