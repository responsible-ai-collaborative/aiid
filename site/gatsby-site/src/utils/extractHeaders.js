import slugify from 'slugify';

// Extract headers from a content object
export const extractHeaders = (content) => {
  const headers = [];

  let richText;

  if (content.length > 0) {
    content.forEach((block) => {
      richText = block.text.richText;
      headers.push(...extractHeadersFromRichText(richText));
    });
  } else {
    richText = content.richText;
    headers.push(...extractHeadersFromRichText(richText));
  }

  return headers;
};

// Extract headers from a rich text object and return an array of headers with id and title
const extractHeadersFromRichText = (richText) => {
  const headers = [];

  richText.forEach((block) => {
    if (block.type === 'heading1' || block.type === 'heading2') {
      headers.push({
        id: slugify(block.text, { lower: true }),
        title: block.text,
      });
    }
  });

  return headers;
};
