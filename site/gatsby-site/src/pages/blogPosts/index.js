import React from 'react';
import { graphql } from 'gatsby';
import PostsListingNew from 'components/blog/PostsListingNew';

const BlogPostsPage = (props) => {
  return (
    <div className="page">
      <PostsListingNew posts={props.data.posts.edges} />
    </div>
  );
};

export default BlogPostsPage;

export const IndexQuery = graphql`
  query BlogPosts($locale: String!) {
    posts: allPrismicBlog(filter: { data: { language: { eq: $locale } } }) {
      edges {
        node {
          uid
          lang
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
    }
  }
`;
