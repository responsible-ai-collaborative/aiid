import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { graphql } from 'gatsby';
import MDXRenderer from 'gatsby-plugin-mdx/mdx-renderer';

import Layout from 'components/Layout';
import NextPrevious from 'components/NextPrevious';
import { StyledHeading, StyledMainWrapper } from 'components/styles/Docs';
import config from '../../config';
import { MDXProvider } from '@mdx-js/react';

const forcedNavOrder = config.sidebar.forcedNavOrder;

const slug = (title) => title.toLowerCase().replace(/\s+/g, '');

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
    const { allMdx, mdx } = data;

    const navItems = allMdx.edges
      .map(({ node }) => node.fields.slug)
      .filter((slug) => slug !== '/')
      .sort()
      .reduce(
        (acc, cur) => {
          if (forcedNavOrder.find((url) => url === cur)) {
            return { ...acc, [cur]: [cur] };
          }

          let prefix = cur.split('/')[1];

          if (config.gatsby && config.gatsby.trailingSlash) {
            prefix = prefix + '/';
          }

          if (prefix && forcedNavOrder.find((url) => url === `/${prefix}`)) {
            return { ...acc, [`/${prefix}`]: [...acc[`/${prefix}`], cur] };
          } else {
            return { ...acc, items: [...acc.items, cur] };
          }
        },
        { items: [] }
      );

    const nav = forcedNavOrder
      .reduce((acc, cur) => {
        return acc.concat(navItems[cur]);
      }, [])
      .concat(navItems.items)
      .map((slug) => {
        if (slug) {
          const { node } = allMdx.edges.find(({ node }) => node.fields.slug === slug);

          return { title: node.fields.title, url: node.fields.slug };
        }
      });

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
        <div className={'addPaddTopBottom'}>
          <NextPrevious mdx={mdx} nav={nav} />
        </div>
      </Layout>
    );
  }
}

export const pageQuery = graphql`
  query ($id: String!) {
    site {
      siteMetadata {
        title
        docsLocation
      }
    }
    mdx(fields: { id: { eq: $id } }) {
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
    allMdx {
      edges {
        node {
          fields {
            slug
            title
          }
        }
      }
    }
  }
`;
