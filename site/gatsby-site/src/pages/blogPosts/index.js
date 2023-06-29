import React from 'react';
import { graphql } from 'gatsby';
import PostsListingNew from 'components/blog/PostsListingNew';

const BlogPostsPage = (props) => (
  <div className="page">
    <PostsListingNew posts={props.data.posts.edges} />
  </div>
);

export default BlogPostsPage;

export const IndexQuery = graphql`
  query BlogPosts {
    posts: allPrismicBlog {
      edges {
        node {
          id
          url

          data {
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
