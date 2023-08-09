import React from 'react';
import { graphql } from 'gatsby';
import PrismicBlogPost from 'components/blog/PrismicBlogPost';

export default function BlogPost(props) {
  const post = props?.data?.post;

  return <>{post && <PrismicBlogPost post={post} location={props.location} />}</>;
}

export const pageQuery = graphql`
  query Post($slug: String!, $locale: String!) {
    site {
      siteMetadata {
        title
        docsLocation
      }
    }
    post: prismicBlog(data: { language: { eq: $locale }, slug: { eq: $slug } }) {
      uid
      data {
        metatitle
        metadescription
        slug
        aitranslated
        language
        title {
          text
        }
        content {
          richText
          text
          html
        }
        image {
          url
          gatsbyImageData
        }
        date
        author
      }
    }
  }
`;
