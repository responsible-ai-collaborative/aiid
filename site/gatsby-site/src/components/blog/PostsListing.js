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
      {posts.map((p) => (
        <StyledPostPreview key={p.fields.slug} post={p} />
      ))}
    </>
  );
}
