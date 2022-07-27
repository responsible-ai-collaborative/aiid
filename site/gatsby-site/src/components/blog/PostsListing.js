import React from 'react';
import PostPreview from './PostPreview';
import styled from 'styled-components';

const StyledPostPreview = styled(PostPreview)`
  & + & {
    margin-top: 1rem;
  }
`;

export default function PostsListing({ posts }) {
  return (
    <>
      <div className="md:tw-grid tw-gap-4 tw-mt-10 lg:tw-gap-4 tw-flex tw-flex-wrap tw-max-w-[750px]">
        {posts.map((p) => (
          <StyledPostPreview key={p.fields.slug} post={p} />
        ))}
      </div>
    </>
  );
}
