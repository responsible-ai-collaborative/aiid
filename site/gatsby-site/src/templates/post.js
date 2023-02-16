import React from 'react';
import AiidHelmet from 'components/AiidHelmet';
import { graphql, Link } from 'gatsby';
import MDXRenderer from 'gatsby-plugin-mdx/mdx-renderer';
import { MDXProvider } from '@mdx-js/react';
import Layout from 'components/Layout';
import { StyledHeading, StyledMainWrapper, Author } from 'components/styles/Post';
import config from '../../config';
import { format } from 'date-fns';
import SocialShareButtons from 'components/ui/SocialShareButtons';
import MdxComponents from 'components/ui/MdxComponents';
import TranslationBadge from 'components/i18n/TranslationBadge';
import { Trans } from 'react-i18next';
import Outline from 'components/Outline';

export default function Post(props) {
  const {
    data: { mdx },
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

  const formattedDate = format(new Date(mdx.frontmatter.date), 'yyyy-MM-dd');

  return (
    <Layout {...{ ...props, rightSidebar }}>
      <AiidHelmet {...{ metaTitle, metaDescription, path: props.location.pathname, metaImage }} />
      <div className={'titleWrapper'}>
        <StyledHeading>{mdx.fields.title}</StyledHeading>

        <div className="inline-block">
          <span>{formattedDate}</span>
          {mdx.frontmatter.aiTranslated && (
            <>
              <TranslationBadge className="ml-2" />
              <Link className="ml-2" to={mdx.frontmatter.slug}>
                <Trans>View Original</Trans>
              </Link>
            </>
          )}
        </div>

        <SocialShareButtons
          metaTitle={metaTitle}
          path={props.location.pathname}
          page="post"
          className="-mt-1"
        ></SocialShareButtons>
      </div>
      <StyledMainWrapper className="prose">
        <MDXProvider components={MdxComponents}>
          <MDXRenderer>{mdx.body}</MDXRenderer>
        </MDXProvider>
        <Author>By {mdx.frontmatter.author}</Author>
      </StyledMainWrapper>
    </Layout>
  );
}

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
      body
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
