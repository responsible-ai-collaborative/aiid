import Parser from '@postlight/parser';
import { format, parseISO } from 'date-fns';
import axios from 'axios';

const stripImages = /!\[[^\]]*\]\((?<filename>.*?)(?="|\))(?<optionalpart>".*")?\)/g;

export default async function handler(req, res) {
  const { url } = req.query;

  const parserConfig = { contentType: 'markdown' };

  const host = new URL(url).host;

  if (['www.washingtonpost.com', 'washingtonpost.com'].includes(host)) {
    parserConfig.html = await getHtmlWithCookies(url);
  }

  const article = await Parser.parse(url, parserConfig);

  const response = {
    title: article.title,
    authors: article.author,
    date_published: article.date_published
      ? format(parseISO(article.date_published), 'yyyy-MM-dd')
      : null,
    date_downloaded: format(new Date(), 'yyyy-MM-dd'),
    image_url: article.lead_image_url,
    text: article.content?.replace(stripImages, '').trim(),
  };

  res.status(200).json(response);
}

const getHtmlWithCookies = async (url) => {
  const axiosInstance = axios.create();

  axiosInstance.defaults.maxRedirects = 0;
  axiosInstance.defaults.withCredentials = true;
  axiosInstance.defaults.credentials = 'same-origin';

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && [301, 302].includes(error.response.status)) {
        const redirectUrl = error.response.headers.location;

        const Cookie = error.response.headers['set-cookie']
          .map((cookie) => cookie.split(';')[0])
          .join('; ');

        return axiosInstance.get(redirectUrl, { headers: { Cookie } });
      }
      return Promise.reject(error);
    }
  );

  axiosInstance.get(url).then((response) => {
    return response.data;
  });
};
