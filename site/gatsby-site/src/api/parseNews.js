import Mercury from '@postlight/mercury-parser';
import { format, parseISO } from 'date-fns';

const stripImages = /!\[[^\]]*\]\((?<filename>.*?)(?="|\))(?<optionalpart>".*")?\)/g;

export default async function handler(req, res) {
  const { url } = req.query;

  const article = await Mercury.parse(url, { contentType: 'markdown' });

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
