import React, { useEffect, useState } from 'react';
import HeadContent from 'components/HeadContent';
import ReactWordcloud from 'react-d3-cloud';

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

const WordCounts = ({ pageContext }) => {
  const { wordClouds, wordCountsSorted, wordsPerCloud } = pageContext;

  return (
    <>
      <div className="titleWrapper">
        <h1>
          <Trans>Word Counts</Trans>
        </h1>
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
          {wordClouds && wordClouds.length == 0 && (
            <div className="flex justify-center">
              <Trans>There are no reports or incidents to process</Trans>
            </div>
          )}
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
    </>
  );
};

export const Head = (props) => {
  const {
    location: { pathname },
  } = props;

  const metaTitle = 'Word Counts';

  const metaDescription = 'Word Counts from Incident Reports.';

  return <HeadContent path={pathname} metaTitle={metaTitle} metaDescription={metaDescription} />;
};

export default WordCounts;
