import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { graphql } from 'gatsby';
import MDXRenderer from 'gatsby-plugin-mdx/mdx-renderer';

import Layout from 'components/Layout';
import { StyledHeading, StyledMainWrapper } from 'components/styles/Docs';
import config from '../../config';
import { MDXProvider } from '@mdx-js/react';
import isString from 'lodash/isString';

const slug = (title) =>
  isString(title) ? title.toLowerCase().replace(/\s+/g, '') : title.props.children;

const Components = {
  h1: ({ children }) => <h1 id={slug(children)}>{children}</h1>,
  h2: ({ children }) => <h2 id={slug(children)}>{children}</h2>,
  h3: ({ children }) => <h3 id={slug(children)}>{children}</h3>,
  h4: ({ children }) => <h4 id={slug(children)}>{children}</h4>,
  h5: ({ children }) => <h5 id={slug(children)}>{children}</h5>,
  h6: ({ children }) => <h6 id={slug(children)}>{children}</h6>,
};

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
        <Helmet>
          {metaTitle ? <title>{metaTitle}</title> : null}
          {metaTitle ? <meta name="title" content={metaTitle} /> : null}
          {metaDescription ? <meta name="description" content={metaDescription} /> : null}
          {metaTitle ? <meta property="og:title" content={metaTitle} /> : null}
          {metaDescription ? <meta property="og:description" content={metaDescription} /> : null}
          {metaTitle ? <meta property="twitter:title" content={metaTitle} /> : null}
          {metaDescription ? (
            <meta property="twitter:description" content={metaDescription} />
          ) : null}
          <link rel="canonical" href={canonicalUrl} />
        </Helmet>
        <div className={'titleWrapper'}>
          <StyledHeading>{mdx.fields.title}</StyledHeading>
        </div>
        <StyledMainWrapper>
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
      }
    }
  }
`;
