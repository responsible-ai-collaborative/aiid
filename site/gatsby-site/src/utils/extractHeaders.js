import { slugify } from './slugify';

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

const extractHeadersFromRichText = (richText) => {
  const headers = [];

  richText.forEach((block) => {
    if (
      block.type === 'heading1' ||
      block.type === 'heading2' ||
      block.type === 'heading3' ||
      block.type === 'heading4' ||
      block.type === 'heading5' ||
      block.type === 'heading6'
    ) {
      headers.push({
        id: slugify(block.text),
        title: block.text,
      });
    }
  });

  return headers;
};
