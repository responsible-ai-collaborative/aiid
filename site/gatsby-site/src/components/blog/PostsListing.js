import React from 'react';
import PostPreview from './PostPreview';

export default function PostsListing({ posts }) {
  return (
    <>
      <div className="tw-post-listing">
        {posts.map((p) => (
          <PostPreview key={p.fields.slug} post={p} />
        ))}
      </div>
    </>
  );
}
