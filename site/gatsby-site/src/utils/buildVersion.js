// Build metadata written by plugins/build-version to public/version.js and
// loaded from <head>: { commit, release, builtAt }. Empty during server-side
// rendering and in development, where the file does not exist.
export const getBuildVersion = () => (typeof window !== 'undefined' && window.AIID_BUILD) || {};
