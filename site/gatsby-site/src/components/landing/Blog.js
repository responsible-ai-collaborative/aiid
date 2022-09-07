import LatestPost from 'components/blog/LatestPost';
import React from 'react';
import { Trans } from 'react-i18next';

export default function Blog() {
  return (
    <>
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        <Trans ns="landing">Latest Blog Post</Trans>
      </h5>
      <LatestPost className="mt-3" />
    </>
  );
}
