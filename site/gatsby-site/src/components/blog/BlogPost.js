import React from 'react';

const BlogPostTemplate = ({ post }) => {
  return (
    <div>
      <h1>{post.node.data.title.text}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.node.data.content.html }} />
    </div>
  );
};

export default BlogPostTemplate;
