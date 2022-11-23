import React, { Component } from 'react';
import AiidHelmet from 'components/AiidHelmet';
import { graphql, Link } from 'gatsby';
import MDXRenderer from 'gatsby-plugin-mdx/mdx-renderer';

import Layout from 'components/Layout';
import { StyledHeading, StyledMainWrapper } from 'components/styles/Docs';
import config from '../../config';
import { MDXProvider } from '@mdx-js/react';
import Components from 'components/ui/MdxComponents';
import TranslationBadge from 'components/i18n/TranslationBadge';
import { Trans } from 'react-i18next';

export default class MDXRuntimeTest extends Component {
  render() {
    const { data } = this.props;

    if (!data) {
      return null;
    }
    const { mdx } = data;

    // meta tags
    const metaTitle = mdx.frontmatter.metaTitle;

    const metaDescription = mdx.frontmatter.metaDescription;

    let canonicalUrl = config.gatsby.siteUrl;

    canonicalUrl =
      config.gatsby.pathPrefix !== '/' ? canonicalUrl + config.gatsby.pathPrefix : canonicalUrl;
    canonicalUrl = canonicalUrl + mdx.fields.slug;

    return (
      <Layout {...this.props}>
        <AiidHelmet {...{ metaTitle, metaDescription, canonicalUrl }} />
        <div className={'titleWrapper'}>
          <StyledHeading>{mdx.fields.title}</StyledHeading>
          {mdx.frontmatter.aiTranslated && (
            <div>
              <TranslationBadge className="d-inline-block" />
              <Link className="d-inline-block ml-2" to={mdx.frontmatter.slug}>
                <Trans>View Original</Trans>
              </Link>
            </div>
          )}
        </div>
        <StyledMainWrapper className="prose">
          <MDXProvider components={Components}>
            <MDXRenderer>{mdx.body}</MDXRenderer>
          </MDXProvider>
        </StyledMainWrapper>
      </Layout>
    );
  }
}

export const pageQuery = graphql`
  query DocsTemplateQuery($slug: String!, $locale: String!) {
    site {
      siteMetadata {
        title
        docsLocation
      }
    }
    mdx(fields: { locale: { eq: $locale } }, frontmatter: { slug: { eq: $slug } }) {
      fields {
        id
        title
        slug
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
        aiTranslated
        slug
      }
    }
  }
`;
