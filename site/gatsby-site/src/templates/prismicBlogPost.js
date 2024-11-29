import React from 'react';
import { graphql } from 'gatsby';
import PrismicBlogPost from 'components/blog/PrismicBlogPost';
import { Link } from 'gatsby';
import HeadContent from 'components/HeadContent';
import { Trans } from 'react-i18next';

export default function BlogPost(props) {
  const post = props?.data?.post;

  const originalPost = props?.data?.originalPost;

  if (post) {
    return <PrismicBlogPost post={post} location={props.location} />;
  } else if (originalPost) {
    return <PrismicBlogPost post={originalPost} location={props.location} />;
  } else if (props?.pageContext?.originalPath) {
    return (
      <Link className="mx-2" to={`${props.pageContext.originalPath}`}>
        <Trans>View Original</Trans>
      </Link>
    );
  } else {
    return <></>;
  }
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
    originalPost: prismicBlog(data: { language: { eq: "en" }, slug: { eq: $slug } }) {
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
