import React from 'react';

const Wordlist = ({ content }) => {
  return (
    <>
      {content.map((value) => (
        <li key={`word-${value[0]}`}>
          {value[0]}: {value[1]}
        </li>
      ))}
    </>
  );
};

export default Wordlist;
