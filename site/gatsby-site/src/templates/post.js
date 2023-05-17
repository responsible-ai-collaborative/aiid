import React from 'react';
import AiidHelmet from 'components/AiidHelmet';
import { graphql, Link } from 'gatsby';
import { MDXProvider } from '@mdx-js/react';
import Layout from 'components/Layout';
import config from '../../config';
import SocialShareButtons from 'components/ui/SocialShareButtons';
import MdxComponents from 'components/ui/MdxComponents';
import TranslationBadge from 'components/i18n/TranslationBadge';
import { Trans } from 'react-i18next';
import Outline from 'components/Outline';
import DateLabel from 'components/ui/DateLabel';
import { LocalizedLink } from 'plugins/gatsby-theme-i18n';

export default function Post(props) {
  const {
    data: { mdx },
    children,
  } = props;

  const metaTitle = mdx.frontmatter.metaTitle;

  const metaDescription = mdx.frontmatter.metaDescription;

  const postImage = mdx.frontmatter.image?.childImageSharp?.gatsbyImageData?.images?.fallback?.src;

  let metaImage = null;

  if (postImage) {
    metaImage = `${config.gatsby.siteUrl}${postImage}`;
  }

  const canonicalUrl = config.gatsby.siteUrl + props.location.pathname;

  const loc = new URL(canonicalUrl);

  const rightSidebar = (
    <>
      <Outline location={loc} />
    </>
  );

  return (
    <Layout {...{ ...props, rightSidebar }}>
      <AiidHelmet {...{ metaTitle, metaDescription, path: props.location.pathname, metaImage }} />
      <div className={'titleWrapper'}>
        <LocalizedLink to="/blog" className="text-lg">
          <Trans>AIID Blog</Trans>
        </LocalizedLink>
        <h1>{mdx.fields.title}</h1>
      </div>
      <div className="flex items-center mb-6 -mt-1 flex-wrap">
        <SocialShareButtons
          metaTitle={metaTitle}
          path={props.location.pathname}
          page="post"
          className="inline-block"
        />
        {mdx.frontmatter.aiTranslated && (
          <>
            <TranslationBadge className="ml-2" />
            <Link className="ml-2" to={mdx.frontmatter.slug}>
              <Trans>View Original</Trans>
            </Link>
          </>
        )}
        <span>
          {' '}
          <Trans>
            Posted <DateLabel date={new Date(mdx.frontmatter.date)} /> by{' '}
            <Author name={mdx.frontmatter.author} />.
          </Trans>
        </span>
      </div>
      <div className={`prose post-styled-main-wrapper`}>
        <MDXProvider components={MdxComponents}>{children}</MDXProvider>
      </div>
    </Layout>
  );
}

var Author = ({ name }) => <span>{name}</span>;

export const pageQuery = graphql`
  query PostTemplateQuery($slug: String!, $locale: String!) {
    site {
      siteMetadata {
        title
        docsLocation
      }
    }
    mdx(fields: { locale: { eq: $locale } }, frontmatter: { slug: { eq: $slug } }) {
      fields {
        title
      }
      tableOfContents
      parent {
        ... on File {
          relativePath
        }
      }
      frontmatter {
        metaTitle
        metaDescription
        author
        date
        aiTranslated
        slug
        image {
          childImageSharp {
            gatsbyImageData(layout: FIXED)
          }
        }
      }
    }
  }
`;
