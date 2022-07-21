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
      <div className="md:tw-grid tw-gap-4 lg:tw-gap-4 md:tw-grid-cols-1 tw-flex">
        {mainPosts.map((p) => (
          <StyledPostPreview key={p.fields.slug} post={p} />
        ))}
      </div>
      <div className="md:tw-grid tw-gap-4 tw-mt-10 lg:tw-gap-4 md:tw-grid-cols-2 xl:tw-grid-cols-2 tw-flex tw-flex-wrap">
        {secondaryPosts.map((p) => (
          <StyledPostPreview key={p.fields.slug} post={p} />
        ))}
      </div>
    </>
  );
}
