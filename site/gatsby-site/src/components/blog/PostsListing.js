import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import PostPreview from './PostPreview';
import styled from 'styled-components';

const StyledPostPreview = styled(PostPreview)`
  & + & {
    margin-top: 1rem;
  }
`;

export default function PostsListing() {
  const {
    allMdx: { edges: posts },
  } = useStaticQuery(graphql`
    query {
      allMdx(
        filter: { fileAbsolutePath: { glob: "**/blog/*" } }
        sort: { fields: frontmatter___date, order: DESC }
      ) {
        edges {
          node {
            fields {
              slug
              title
            }
            excerpt
            frontmatter {
              date
              author
              image {
                childImageSharp {
                  gatsbyImageData(layout: FIXED)
                }
              }
            }
          }
        }
      }
    }
  `);

  return (
    <>
      {posts.map((p) => (
        <StyledPostPreview key={p.node.fields.slug} post={p.node} />
      ))}
    </>
  );
}
