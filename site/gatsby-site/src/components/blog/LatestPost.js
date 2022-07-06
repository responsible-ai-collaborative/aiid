import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import PostPreview from './PostPreview';
import { useLocalization } from 'gatsby-theme-i18n';

export default function LatestPost({ className }) {
  const {
    allMdx: { nodes: posts },
  } = useStaticQuery(graphql`
    query {
      allMdx(
        filter: { fields: { slug: { glob: "/blog/**" } } }
        sort: { order: DESC, fields: frontmatter___date }
      ) {
        nodes {
          fileAbsolutePath
          fields {
            slug
            title
            locale
          }
          slug
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
  `);

  const { locale } = useLocalization();

  const post = posts.find((p) => p.fields.locale == locale);

  return <PostPreview post={post} className={className} />;
}
