import React from 'react';
import Helmet from 'react-helmet';
import ReactWordcloud from 'react-wordcloud';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { Layout, Link } from '@components';
import { StyledHeading, StyledMainWrapper } from '../components/styles/Docs';

const wordCloudSize = [350, 350];

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

const WordCloudCell = ({ wordCountsSorted, wordCloudOptions, wordCloudSize, wordCloud }) => {
  return (
    <Row>
      <Col xs={4}>
        <Wordlist content={wordCountsSorted} />
      </Col>
      <Col xs={8}>
        <ReactWordcloud options={wordCloudOptions} size={wordCloudSize} words={wordCloud} />
      </Col>
    </Row>
  );
};

const WordCounts = ({ pageContext, ...props }) => {
  const { wordClouds, wordCountsSorted, wordsPerCloud } = pageContext;

  if (!wordClouds || !wordCountsSorted) {
    return null;
  }

  const wordCloudOptions = {
    rotations: 3,
    rotationAngles: [-90, 0],
  };

  return (
    <Layout {...props}>
      <Helmet>
        <title>Word Counts</title>
      </Helmet>
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
          <Link to="/about_apps/1-discover"> Discover app</Link>.
        </p>
        <Container>
          <ul>
            {wordClouds.map((wordCloud, idx) => (
              <WordCloudCell
                key={`wordcloud-${idx}`}
                wordCountsSorted={wordCountsSorted.slice(0, (idx + 1) * wordsPerCloud)}
                wordCloudOptions={wordCloudOptions}
                wordCloudSize={wordCloudSize}
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
