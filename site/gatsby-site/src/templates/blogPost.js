import React, { Component } from 'react';
import { graphql } from 'gatsby';
import BlogPostNew from 'components/blog/BlogPostNew';

class Post extends Component {
  render() {
    const post = this.props.data.post;

    return (
      <>
        <BlogPostNew post={post} />
      </>
    );
  }
}

export default Post;

export const postQuery = graphql`
  query Post($uid: String) {
    post: prismicBlog(uid: { eq: $uid }) {
      id
      uid
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
`;
