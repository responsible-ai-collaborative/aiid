import React, { useEffect, useState } from 'react';
import AiidHelmet from 'components/AiidHelmet';
import ReactWordcloud from 'react-d3-cloud';

import Layout from 'components/Layout';
import Link from 'components/ui/Link';
import Wordlist from '../components/WordList';
import { Trans } from 'react-i18next';

const WordCloudCell = ({ wordCountsSorted, wordCloud }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div>
      <div data-cy="wordlist-container">
        <Wordlist content={wordCountsSorted} />
      </div>
      <div>
        {mounted && (
          <div data-cy="wordcloud">
            <ReactWordcloud data={wordCloud} />
          </div>
        )}
      </div>
    </div>
  );
};

const WordCounts = ({ pageContext, ...props }) => {
  const { wordClouds, wordCountsSorted, wordsPerCloud } = pageContext;

  return (
    <Layout {...props}>
      <AiidHelmet path={props.location.pathname}>
        <title>Word Counts</title>
      </AiidHelmet>
      <div className="titleWrapper">
        <h1 className="font-karla font-bold flex-1 pt-0">Word Counts</h1>
      </div>
      <div className="styled-main-wrapper">
        <p className="paragraph">
          <Trans i18nKey="wordcountAbout" ns="wordcount">
            This is a list of the words in incident reports ranked by their counts. Common words
            (i.e., &quot;stop words&quot;) are removed from the list, and the stems of the words are
            displayed rather than the conjugations found within the text. Words with fewer than 10
            appearances and fewer than 3 letters are not included. If you would like to explore the
            contents of the reports, you should work through the
            <Link to="/apps/discover"> Discover app</Link>.
          </Trans>
        </p>
        <div>
          <ul className="pl-0 list-revert">
            {wordClouds &&
              wordCountsSorted &&
              wordClouds.map((wordCloud, idx) => (
                <WordCloudCell
                  key={`wordcloud-${idx}`}
                  wordCountsSorted={wordCountsSorted.slice(
                    idx * wordsPerCloud,
                    idx * wordsPerCloud - 1 + wordsPerCloud
                  )}
                  wordCloud={wordCloud}
                />
              ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default WordCounts;
