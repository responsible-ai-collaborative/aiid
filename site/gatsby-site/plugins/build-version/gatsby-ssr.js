import React from 'react';

// A small blocking script in <head>, so window.AIID_BUILD is set before the
// app bundle and Sentry start. The tag is the same in every build; only the
// file it loads changes. Development builds have no version.js, so skip it.
export const onRenderBody = ({ setHeadComponents }) => {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  setHeadComponents([<script key="build-version" src="/version.js" />]);
};
