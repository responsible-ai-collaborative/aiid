import React from 'react';
import { graphql } from 'gatsby';
import BlogPostNew from 'components/blog/BlogPostNew';

export default function BlogPost(props) {
  const post = props.data.post;

  return (
    <>
      <BlogPostNew post={post} location={props.location} />
    </>
  );
}

export const pageQuery = graphql`
  query Post($uid: String) {
    site {
      siteMetadata {
        title
        docsLocation
      }
    }
    post: prismicBlog(uid: { eq: $uid }) {
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
