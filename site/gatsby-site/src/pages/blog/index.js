import { graphql } from 'gatsby';
import React from 'react';
import PostsListing from 'components/blog/PostsListing';
import AiidHelmet from 'components/AiidHelmet';

export default function BlogPage(props) {
  const {
    allMdx: { nodes: posts },
  } = props.data;

  return (
    <>
      <AiidHelmet metaTitle={'AIID Blog'} path={props.location.pathname} />
      <div className={'titleWrapper'}>
        <h1>Blog</h1>
      </div>
      <div>
        <PostsListing posts={posts} />
      </div>
    </>
  );
}

export const query = graphql`
  query BlogQuery($locale: String) {
    allMdx(
      filter: { fields: { slug: { glob: "/blog/**" }, locale: { eq: $locale } } }
      sort: { frontmatter: { date: DESC } }
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
