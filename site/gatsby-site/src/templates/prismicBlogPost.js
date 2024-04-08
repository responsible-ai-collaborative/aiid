import React from 'react';
import { graphql } from 'gatsby';
import PrismicBlogPost from 'components/blog/PrismicBlogPost';
import HeadContent from 'components/HeadContent';

export default function BlogPost(props) {
  const post = props?.data?.post;

  return <>{post && <PrismicBlogPost post={post} location={props.location} />}</>;
}

export const Head = (props) => {
  const post = props?.data?.post;

  return (
    <>
      {post && (
        <HeadContent
          metaTitle={post.data.metatitle}
          metaDescription={post.data.metadescription}
          path={props.location.pathname}
          metaImage={post.data.image?.gatsbyImageData?.images?.fallback?.src}
        />
      )}
    </>
  );
};

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
