import React, { useEffect, useState } from 'react';
import AiidHelmet from 'components/AiidHelmet';
import ReactWordcloud from 'react-d3-cloud';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import Layout from 'components/Layout';
import Link from 'components/ui/Link';
import { StyledHeading, StyledMainWrapper } from 'components/styles/Docs';
import Wordlist from '../components/WordList';
import { Trans } from 'react-i18next';

const WordCloudCell = ({ wordCountsSorted, wordCloud }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <Row>
      <Col xs={4} data-cy="wordlist-container">
        <Wordlist content={wordCountsSorted} />
      </Col>
      <Col xs={8}>
        {mounted && (
          <div data-cy="wordcloud">
            <ReactWordcloud data={wordCloud} />
          </div>
        )}
      </Col>
    </Row>
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
        <StyledHeading>Word Counts</StyledHeading>
      </div>
      <StyledMainWrapper>
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
        <Container>
          <ul className="pl-0 list-revert">
            {wordClouds &&
              wordCountsSorted &&
              wordClouds.map((wordCloud, idx) => (
                <WordCloudCell
                  key={`wordcloud-${idx}`}
                  wordCountsSorted={wordCountsSorted.slice(0, (idx + 1) * wordsPerCloud)}
                  wordCloud={wordCloud}
                />
              ))}
          </ul>
        </Container>
      </StyledMainWrapper>
    </Layout>
  );
};

export default WordCounts;
