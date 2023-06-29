import React from 'react';
import PostPreviewNew from './PostPreviewNew';

export default function PostsListingNew({ posts }) {
  return (
    <>
      <div className="tw-post-listing">
        {posts.map((p) => (
          <PostPreviewNew key={p.node.id} post={p.node} />
        ))}
      </div>
    </>
  );
}
