import Parser from '@postlight/parser';
import { format, parseISO } from 'date-fns';
import axios from 'axios';

const stripImages = /!\[[^\]]*\]\((?<filename>.*?)(?="|\))(?<optionalpart>".*")?\)/g;

exports.handler = async function (event) {
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
  const TIMEOUT_DURATION = 5000; // Timeout after 10 seconds

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Parser.parse timed out')), TIMEOUT_DURATION)
  );

  try {
    const parserConfig = { contentType: 'markdown' };

    if (config.cookies) {
      parserConfig.html = await getHtmlWithCookies(url);
    }

    // Race the Parser.parse call with the timeout
    const article = await Promise.race([
      Parser.parse(url, parserConfig),
      timeoutPromise
    ]);

    return article;
  } catch (error) {
    console.log("Couldn't parse article", error.message);

    if (error.message === 'Parser.parse timed out') {
      console.log('The parser timed out. Retrying...');
    }

    if (config.cookies) {
      console.log('Cookies were already enabled. Rethrowing error');
      throw error; // Rethrow the error if cookies were already enabled
    } else {
      console.log('Retrying with cookies enabled');
      return await getArticle(url, { cookies: true });
    }
  }
};

const getHtmlWithCookies = async (url) => {
  console.log('Fetching HTML with cookies', url);
  const axiosInstance = axios.create({
    timeout: 10000, // 10 seconds timeout
    maxRedirects: 0, // Prevent automatic redirects
    withCredentials: true, // Send cookies with request
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.log('Intercepted error', error.message);

      // Handle HTTP 3xx Redirects with Cookies
      if (error.response && [301, 302].includes(error.response.status)) {
        console.log('Handling redirect', error.response.status);

        const redirectUrl = error.response.headers.location;

        const Cookie = error.response.headers['set-cookie']
          .map((cookie) => cookie.split(';')[0])
          .join('; ');

        return axiosInstance.get(redirectUrl, { headers: { Cookie } });
      }

      return Promise.reject(error);
    }
  );

  try {
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch HTML with cookies', error.message, error.code);
    if (error.code === 'ECONNABORTED') {
      console.error('Request timed out', error.message);
    } else {
      console.error('Request failed', error.message);
    }
    throw error;
  }
};
