import slugify from 'slugify';

// Extract headers from a content object
export const extractHeaders = (content) => {
  const headers = [];

  let richText;

  if (content.length > 0) {
    content.forEach((block) => {
      richText = block.text.richText;
      if (richText && richText.length > 0) {
        headers.push(...extractHeadersFromRichText(richText));
      }
      if (block?.markdown && block.markdown.richText.length > 0) {
        headers.push(...extractHeadersFromMarkdown(block.markdown.richText[0]?.text));
      }
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

// Extract headers from markdown and return an array of headers with id and title
export const extractHeadersFromMarkdown = (markdown) => {
  if (!markdown) {
    return [];
  }

  const headers = [];

  const lines = markdown.split('\n');

  lines.forEach((line) => {
    const match = line.match(/^(#{1,2})\s+(.*)/); // Match `#` or `##` headers

    if (match) {
      const level = match[1].length; // 1 for `#`, 2 for `##`

      const title = match[2];

      headers.push({
        id: slugify(title, {
          lower: true,
          remove: /["'`?!]/g, // Removes quotes and similar characters
        }),
        title,
        level,
      });
    }
  });

  return headers;
};
