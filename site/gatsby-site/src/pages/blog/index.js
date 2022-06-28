import Layout from 'components/Layout';
import { StyledHeading, StyledMainWrapper } from 'components/styles/Docs';
import { graphql } from 'gatsby';
import React from 'react';
import PostsListing from '../../components/blog/PostsListing';

export default function BlogPage(props) {
  const {
    allMdx: { nodes: posts },
  } = props.data;

  return (
    <Layout {...props}>
      <div className={'titleWrapper'}>
        <StyledHeading>Blog</StyledHeading>
      </div>
      <StyledMainWrapper>
        <PostsListing posts={posts} />
      </StyledMainWrapper>
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
