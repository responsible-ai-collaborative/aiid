import React, { useState } from 'react';
import ReactPlayer from 'react-player/lazy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeMute, faVolumeUp } from '@fortawesome/free-solid-svg-icons';

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
  const [play, setPlay] = useState(false);
  const handleMouseEnter = () => {
    setPlay(true);
  };
  const handleMouseLeave = () => {
    setPlay(false);
  };

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

  const handleMouseEnter = () => {
    setPlay(true);
  };

  const handleMouseLeave = () => {
    setPlay(false);
  };

  const handleMuteToggle = () => {
    setIsMuted(prevIsMuted => !prevIsMuted);
    setVolume(prevVolume => prevVolume === 0 ? 0.5 : 0);
  }

  const [play, setPlay] = useState(false);
  const [useVideo, setUseVideo] = useState(isVideo(mediaURL));
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);

  return useVideo ? (
<<<<<<< Updated upstream
    <div className={`aspect-w-16 aspect-h-9 ${className}`}  onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <ReactPlayer
        url={mediaURL}
        controls={false}
        muted={true}
        playing={play}
=======
    <div className={`aspect-w-16 aspect-h-9 ${className}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <ReactPlayer
        url={mediaURL}
        controls={false}
        muted={isMuted}
        volume={volume}
>>>>>>> Stashed changes
        pip
        fallback={fallback}
        playing={play}
        onError={(e) => onPlayerError(e)}
        width="100%"
        height="100%"
      />
      <button onClick={handleMuteToggle}>
        <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeUp} />
      </button>
    </div>
  ) : (
    fallback
  );
};

export default VideoPlayer;
