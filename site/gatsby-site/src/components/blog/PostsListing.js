import React, { useEffect, useState } from 'react';
import PostPreview from './PostPreview';
import PrismicPostPreview from './PrismicPostPreview';

export default function PostsListing({ posts, mdxBlogPosts }) {
  const [sortedPosts, setSortedPosts] = useState([]);

  useEffect(() => {
    // Add an mdx field to each object and flatten the structure
    const mdxBlogPostsWithFlag = mdxBlogPosts.map((post) => ({
      ...post,
      date: post.frontmatter.date,
      mdx: true,
    }));

    const postsWithFlag = posts.map((post) => ({
      ...post,
      date: post.node.data.date,
      mdx: false,
    }));

    const mergedPosts = [...mdxBlogPostsWithFlag, ...postsWithFlag];

    const sortedPosts = mergedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    setSortedPosts(sortedPosts);
  }),
    [posts, mdxBlogPosts];

  return (
    <>
      <div className="tw-post-listing">
        {sortedPosts.map((p) => {
          return p.mdx ? (
            <PostPreview key={p.fields.slug} post={p} />
          ) : (
            <PrismicPostPreview key={p.node.id} post={p.node} />
          );
        })}
      </div>
    </>
  );
}
