import React, { useEffect, useState } from 'react';
import PostPreview from './PostPreview';
import styled from 'styled-components';

const StyledPostPreview = styled(PostPreview)`
  & + & {
    margin-top: 1rem;
  }
`;

export default function PostsListing({ posts }) {
  const [mainPosts, setMainPosts] = useState([]);

  const [secondaryPosts, setSecondaryPosts] = useState([]);

  useEffect(() => {
    const mainPosts = posts.slice(0, 1);

    const secondaryPosts = posts.slice(1, posts.length);

    setMainPosts(mainPosts);
    setSecondaryPosts(secondaryPosts);
  }, [posts]);

  return (
    <>
      <div className="grid gap-4 lg:gap-4 md:grid-cols-1">
        {mainPosts.map((p) => (
          <StyledPostPreview key={p.fields.slug} post={p} />
        ))}
      </div>
      <div className="grid gap-4 mt-10 lg:gap-4 md:grid-cols-2 xl:grid-cols-2">
        {secondaryPosts.map((p) => (
          <StyledPostPreview key={p.fields.slug} post={p} />
        ))}
      </div>
    </>
  );
}
