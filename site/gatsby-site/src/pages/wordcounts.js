import React from 'react';
import AiidHelmet from 'components/AiidHelmet';
import ReactWordcloud from 'react-d3-cloud';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import Layout from 'components/Layout';
import Link from 'components/ui/Link';
import { StyledHeading, StyledMainWrapper } from 'components/styles/Docs';
import Wordlist from '../components/WordList';

const WordCloudCell = ({ wordCountsSorted, wordCloud }) => {
  return (
    <Row>
      <Col xs={4} data-cy="wordlist-container">
        <Wordlist content={wordCountsSorted} />
      </Col>
      <Col xs={8}>
        {typeof window !== 'undefined' && <ReactWordcloud data-cy="wordcloud" data={wordCloud} />}
      </Col>
    </Row>
  );
};

const WordCounts = ({ pageContext, ...props }) => {
  const { wordClouds, wordCountsSorted, wordsPerCloud } = pageContext;

  if (!wordClouds || !wordCountsSorted) {
    return null;
  }

  return (
    <Layout {...props}>
      <AiidHelmet>
        <title>Word Counts</title>
      </AiidHelmet>
      <div className="titleWrapper">
        <StyledHeading>Word Counts</StyledHeading>
      </div>
      <StyledMainWrapper>
        <p className="paragraph">
          This is a list of the words in incident reports ranked by their counts. Common words
          (i.e., &quot;stop words&quot;) are removed from the list, and the stems of the words are
          displayed rather than the conjugations found within the text. Words with fewer than 10
          appearances and fewer than 3 letters are not included. If you would like to explore the
          contents of the reports, you should work through the
          <Link to="/apps/discover"> Discover app</Link>.
        </p>
        <Container>
          <ul>
            {wordClouds.map((wordCloud, idx) => (
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
