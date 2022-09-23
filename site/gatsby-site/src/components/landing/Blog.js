import PostPreview from 'components/blog/PostPreview';
import React from 'react';

export default function Blog({ post }) {
  return <PostPreview post={post} latestPost={true} />;
}
