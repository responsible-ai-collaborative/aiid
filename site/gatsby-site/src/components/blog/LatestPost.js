import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import PostPreview from './PostPreview';

export default function LatestPost({ className }) {
  const {
    allMdx: {
      edges: {
        0: { node: post },
      },
    },
  } = useStaticQuery(graphql`
    query {
      allMdx(
        filter: { fileAbsolutePath: { glob: "**/blog/*" } }
        sort: { fields: frontmatter___date, order: DESC }
        limit: 1
      ) {
        edges {
          node {
            fileAbsolutePath
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

  return <PostPreview post={post} className={className} />;
}
