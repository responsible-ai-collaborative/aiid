// import React from 'react';

function checkYoutube(id) {
  // check if the video exist
  const img = new Image();

  img.src = 'http://img.youtube.com/vi/' + id + '/mqdefault.jpg';

  return new Promise((resolve, reject) => {
    img.onload = function () {
      const thumbnailExists = checkThumbnail(img.width);

      resolve(thumbnailExists);
    };

    img.onerror = function () {
      reject(new Error('Failed to load image'));
    };
  });
}

function checkThumbnail(width) {
  // A mq thumbnail has width of 320.
  // If the video does not exist (therefore thumbnail don't exist), a default thumbnail of 120 width is returned.
  return width === 320;
}

async function checkVimeo(id) {
  // check if the viemo video is reachable
  const apiUrl = `https://vimeo.com/api/v2/video/${id}.json`;

  try {
    const response = await fetch(apiUrl);

    const json = await response.json();

    return json && json.length > 0;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function checkLink(url) {
  const vimeoRegex = /^https?:\/\/(www.)?vimeo.com\/([a-zA-Z0-9_-]+)/;

  const youtubeRegex =
    /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w]+\?v=|embed\/|v\/)?)([\w]+)(\S+)?$/;

  // check if the youtube url exist.
  if (youtubeRegex.test(url)) {
    return checkYoutube(url.match(youtubeRegex)[5]);
  }

  // check if the youtube url exist.
  if (vimeoRegex.test(url)) {
    return checkVimeo(url.match(vimeoRegex)[2]);
  }

  return false;
}

export default checkLink;
