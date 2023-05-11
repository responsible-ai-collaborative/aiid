import React, { useState } from 'react';
import ReactPlayer from 'react-player/lazy';
import { isVideo } from 'utils/video';

/*
  Example videos:
   - youtube - https://youtu.be/cQ54GDm1eL0
   - vimeo   - https://vimeo.com/753626331
*/

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

  const [useVideo, setUseVideo] = useState(true);

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
