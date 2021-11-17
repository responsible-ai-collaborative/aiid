import React from 'react';

/**
 * Check if last word is parenthesized
 *
 * @param {string} str
 * @return {boolean} result
 */
export function checkParenthetical(str) {
  return /\((.*)\)/gm.test(str);
}

/**
 * Get comma seperated formatted name. First Name is the last word of the string
 *
 * @param {string} str
 * @return {string} "First Name, Last Name"
 */
export function getFormattedName(str) {
  const split = str.split(' ');

  // One word, return itself
  if (split.length <= 1) {
    return str;
  }

  // Special case of organizational collaboration
  if (str === 'CSET annotators') {
    return str;
  }

  if (checkParenthetical(split[split.length - 1])) {
    split.pop();

    if (split.length > 1) {
      // More than two words + parenthesized word, return "FirstName, LastName"
      return `${split[split.length - 1]}, ${split.slice(0, split.length - 1).join(' ')}`;
    } else {
      // One word + parenthesized word, return origin
      return str;
    }
  } else {
    return `${split[split.length - 1]}, ${split.slice(0, split.length - 1).join(' ')}`;
  }
}

export const getParagraphs = (itemText) => {
  return (
    <>
      {itemText.split('\n').map((paragraph, index, array) => (
        <p key={index}>
          {array.length - 1 === index ? <>{paragraph + '...'}</> : <>{paragraph}</>}
        </p>
      ))}
    </>
  );
};
