import Layout from 'components/Layout';
import { StyledHeading } from 'components/styles/Docs';
import { graphql } from 'gatsby';
import React from 'react';
import PostsListing from 'components/blog/PostsListing';
import AiidHelmet from 'components/AiidHelmet';

export default function BlogPage(props) {
  const {
    allMdx: { nodes: posts },
  } = props.data;

  return (
    <Layout {...props}>
      <AiidHelmet metaTitle={'AIID Blog'} path={props.location.pathname} />
      <div className={'titleWrapper'}>
        <StyledHeading>Blog</StyledHeading>
      </div>
      <div>
        <PostsListing posts={posts} />
      </div>
    </Layout>
  );
}

export const query = graphql`
  query BlogQuery($locale: String) {
    allMdx(
      filter: { fields: { slug: { glob: "/blog/**" }, locale: { eq: $locale } } }
      sort: { fields: frontmatter___date, order: DESC }
    ) {
      nodes {
        fields {
          slug
          title
        }
        excerpt
        frontmatter {
          date
          author
          slug
          image {
            childImageSharp {
              gatsbyImageData(layout: FIXED)
            }
          }
        }
      }
    }
  }
`;
