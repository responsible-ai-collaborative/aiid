import { withSentry } from "../../sentry-instrumentation";
import Parser from '@postlight/parser';
import { format, parseISO } from 'date-fns';
import axios from 'axios';

const stripImages = /!\[[^\]]*\]\((?<filename>.*?)(?="|\))(?<optionalpart>".*")?\)/g;

const handler = async function (event) {
  try {
    const url = event.queryStringParameters.url;

    const article = await getArticle(url, { cookies: false });

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

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
      }),
    };
  }
};

// Runs first with { cookies: false },
// then on error recurses with { cookies: true } as a fallback.
const getArticle = async (url, config) => {
  try {
    const parserConfig = { contentType: 'markdown' };

    if (config.cookies) {
      parserConfig.html = await getHtmlWithCookies(url);
    }

    const article = await Parser.parse(url, parserConfig);

    return article;
  } catch (error) {
    if (config.cookies) {
      throw error;
    } else {
      return await getArticle(url, { cookies: true });
    }
  }
};

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

  const response = await axiosInstance.get(url);

  return response.data;
};

module.exports = { handler: withSentry(handler) };