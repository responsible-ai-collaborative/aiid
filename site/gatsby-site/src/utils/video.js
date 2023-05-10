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

const youtubeRegex =
  /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w]+\?v=|embed\/|v\/)?)([\w]+)(\S+)?$/;

const vimeoRegex = /^https?:\/\/(www.)?vimeo.com\/([a-zA-Z0-9_-]+)/;

export const videoCloudinaryID = (publicID) => {
  if (publicID.startsWith('reports/')) {
    publicID = publicID.replace('reports/', '');
  }

  if (youtubeRegex.test(publicID)) {
    return 'youtube/' + publicID.match(youtubeRegex)[5];
  }

  if (vimeoRegex.test(publicID)) {
    return 'vimeo/' + publicID.match(vimeoRegex)[2];
  }

  return publicID;
};

export const isVideo = (url) => {
  return youtubeRegex.test(url) || vimeoRegex.test(url);
};

export async function checkLink(url) {
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
