import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { graphql } from 'gatsby';
import MDXRenderer from 'gatsby-plugin-mdx/mdx-renderer';

import Layout from 'components/Layout';
import NextPrevious from 'components/NextPrevious';
import { StyledHeading, StyledMainWrapper } from 'components/styles/Docs';
import config from '../../config';
import { Leaderboards } from '../../pages/summaries/leaderboard';
import { Link } from 'gatsby';

const forcedNavOrder = config.sidebar.forcedNavOrder;

const LEADERBOARDS = [
  {
    title: 'Submitters',
    attribute: 'submitters',
  },
  {
    title: 'Authors',
    attribute: 'authors',
  },
  {
    title: 'Domains',
    attribute: 'source_domain',
  },
];

export default class MDXRuntimeTest extends Component {
  render() {
    const { data, location } = this.props;

    if (!data) {
      return null;
    }
    const {
      allMdx,
      mdx,
      allMongodbAiidprodIncidents: { nodes },
    } = data;

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
        {location.pathname === '/' && (
          <>
            <h2>Incident Report Submission Leaderboards</h2>
            <Leaderboards
              leaderboardsToGenerate={LEADERBOARDS}
              incidentData={nodes}
              limit={3}
              itemRender={(item, index) => (
                <li key={`${item.label}-${index}`}>
                  <Link to={`/apps/discover?${item.attribute}=${item.label}`}>
                    {`${item.label}: ${item.value}`}
                  </Link>
                </li>
              )}
            />
          </>
        )}
        <StyledMainWrapper>
          <MDXRenderer>{mdx.body}</MDXRenderer>
        </StyledMainWrapper>
        <div className={'addPaddTopBottom'}>
          <NextPrevious mdx={mdx} nav={nav} />
        </div>
      </Layout>
    );
  }
}

export const pageQuery = graphql`
  query($id: String!) {
    allMongodbAiidprodIncidents {
      nodes {
        id
        authors
        source_domain
        submitters
      }
    }
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
