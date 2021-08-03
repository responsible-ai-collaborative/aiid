import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import PostPreview from './PostPreview';
import { Card } from 'react-bootstrap';
import styled from 'styled-components';

const StyledCard = styled(Card)`
  padding: 0.75rem 0 0;
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
                  fluid(maxWidth: 800) {
                    ...GatsbyImageSharpFluid
                  }
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
        <StyledCard key={p.node.fields.slug}>
          <PostPreview post={p.node} />
        </StyledCard>
      ))}
    </>
  );
}
