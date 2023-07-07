import React from 'react';
import PostPreview from './PostPreview';
import PostPreviewNew from './PostPreviewNew';

export default function PostsListing({ posts, oldBlogPosts }) {
  return (
    <>
      <div className="tw-post-listing">
        {posts.map((p) => (
          <PostPreviewNew key={p.node.id} post={p.node} />
        ))}
        {oldBlogPosts.map((p) => (
          <PostPreview key={p.fields.slug} post={p} />
        ))}
      </div>
    </>
  );
}
