import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import stopword from 'stopword';
import stemmer from 'stemmer';
import customStopWords from '../../constants/customStopWords';

const Wordlist = ({ content, limit }) => {
  return (
    <>
      {content.map(
        (value, idx) =>
          idx < limit && (
            <li key={`word-${value[0]}`}>
              {value[0]}: {value[1]}
            </li>
          )
      )}
    </>
  );
};

const WordcountComponent = ({ limit }) => {
  return (
    <StaticQuery
      query={graphql`
        query WordCounts {
          allMongodbAiidprodIncidents {
            nodes {
              text
            }
          }
        }
      `}
      render={(data) => {
        const wordCounts = {};

        data.allMongodbAiidprodIncidents.nodes.forEach((element) => {
          if (element['text']) {
            const words = stopword.removeStopwords(element['text'].split(' '), customStopWords);

            for (let i = 0; i < words.length; i++) {
              let word = stemmer(words[i].toLowerCase().replace(/\W/g, ''));

              if (word in wordCounts) {
                wordCounts[word] += 1;
              } else {
                wordCounts[word] = 1;
              }
            }
          }
        });

        let wordCountsSorted = [];

        for (let word in wordCounts) {
          if (wordCounts[word] > 99 && word.length > 2)
            wordCountsSorted.push([word, wordCounts[word]]);
        }

        wordCountsSorted.sort(function (a, b) {
          return b[1] - a[1];
        });

        return (
          <>
            <h1 className="heading1">Word Count</h1>
            <ul>
              <Wordlist limit={limit} content={wordCountsSorted} />
            </ul>
          </>
        );
      }}
    />
  );
};

export default WordcountComponent;
