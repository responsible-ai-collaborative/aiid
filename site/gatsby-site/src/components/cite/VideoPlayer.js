import React, { useState } from 'react';
import ReactPlayer from 'react-player/lazy';

/*
  Example videos:

  youtube       - https://youtu.be/cQ54GDm1eL0
  vimeo         - https://vimeo.com/753626331
  streamable    - https://streamable.com/4f031u
*/

export const youtubeRegex =
  /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w]+\?v=|embed\/|v\/)?)([\w]+)(\S+)?$/;

export const vimeoRegex = /^https?:\/\/(www.)?vimeo.com\/([a-zA-Z0-9_-]+)/;

// const twitterRegex = /^https:\/\/(www.)?twitter.com\/\w+\/status\/([0-9]+)/;

export const isVideo = (url) => {
  if (youtubeRegex.test(url)) {
    return 'youtube/' + url.match(youtubeRegex)[5];
  }

  if (vimeoRegex.test(url)) {
    return 'vimeo/' + url.match(vimeoRegex)[2];
  }

  return false;
};

// grab the video_id type
export const typeMedia = (url) => {
  // return the youtube id.
  if (youtubeRegex.test(url)) {
    return 'youtube';
  }

  // return the vimeo id
  if (vimeoRegex.test(url)) {
    return 'vimeo';
  }

  return 'fall_back';
};

export const grabVideoID = (video_id, url) => {
  // return the youtube id.

  if (video_id == 'youtube') {
    return url.match(youtubeRegex)[5];
  }

  // return the vimeo id
  if (video_id == 'vimeo') {
    return url.match(vimeoRegex)[2];
  }
  return 'fall_back';
};

const VideoPlayer = ({ mediaURL, className = '', fallback = null, onError = () => {} }) => {
  if (!isVideo(mediaURL)) {
    return fallback;
  }

  if (!ReactPlayer.canPlay(mediaURL)) {
    console.log(`URL ${mediaURL} can't be played by ReactPlayer.`);
    return fallback;
  }

  function onPlayerError(err) {
    console.log(`ReactPlayer error on video ${mediaURL}: ${err}`);
    onError();
    setUseVideo(false);
  }

  const [useVideo, setUseVideo] = useState(isVideo(mediaURL));

  return useVideo ? (
    <div className={`aspect-w-16 aspect-h-9 ${className}`}>
      <ReactPlayer
        url={mediaURL}
        controls
        muted
        pip
        fallback={fallback}
        onError={(e) => onPlayerError(e)}
        width="100%"
        height="100%"
      />
    </div>
  ) : (
    fallback
  );
};

export default VideoPlayer;
