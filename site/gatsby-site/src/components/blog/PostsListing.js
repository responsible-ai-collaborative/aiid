import React from 'react';
import PostPreview from './PostPreview';
import PrismicPostPreview from './PrismicPostPreview';

export default function PostsListing({ posts, mdxBlogPosts }) {
  return (
    <>
      <div className="tw-post-listing">
        {posts.map((p) => (
          <PrismicPostPreview key={p.node.id} post={p.node} />
        ))}
        {mdxBlogPosts.map((p) => (
          <PostPreview key={p.fields.slug} post={p} />
        ))}
      </div>
    </>
  );
}
