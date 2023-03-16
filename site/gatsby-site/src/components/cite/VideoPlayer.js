import React from 'react';

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

// export const constructVideoURL = (videoID, videoPlatform) => {
//   switch (videoPlatform) {
//     case 'youtube':
//       return `https://youtu.be/${videoID}`;
//     case 'vimeo':
//       return `https://vimeo.com/${videoID}`;
//     case 'streamable':
//       return `https://streamable.com/${videoID}`;
//     default:
//       console.log('Unknown video platform.');
//       return '';
//   }
// };

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

const VideoPlayer = ({ incidentID, mediaURL, className = '' }) => {
  const embedLink = (videoID, videoPlatform) => {
    switch (videoPlatform) {
      case 'youtube':
        return `https://www.youtube.com/embed/${videoID}`;
      case 'vimeo':
        return `https://player.vimeo.com/video/${videoID}`;
      //   case 'streamable':
      //     return `https://streamable.com/e/${videoID}`;
      default:
        console.log('Unknown video platform.');
        return '';
    }
  };

  const videoPlatform = typeMedia(mediaURL);

  const videoID = grabVideoID(videoPlatform, mediaURL);

  const embedURL = embedLink(videoID, videoPlatform);

  const embedTitle = `Video player for Incident ${incidentID} (${videoPlatform} video ${videoID})`;

  return (
    <div className={`aspect-w-16 aspect-h-9 ${className}`}>
      <iframe
        className={`self-center`}
        src={embedURL}
        title={embedTitle}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
};

export default VideoPlayer;
