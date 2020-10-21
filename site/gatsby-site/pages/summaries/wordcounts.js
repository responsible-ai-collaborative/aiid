import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { graphql } from 'gatsby';

import uuid from 'react-uuid'

import ReactWordcloud from 'react-wordcloud'
import stopword from 'stopword'
import stemmer from 'stemmer'

import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import { Layout, Link } from '$components';
import config from '../../config';
import { Edit, StyledHeading, StyledMainWrapper } from '../../src/components/styles/Docs';

const englishStopwords = stopword.en
const customStopWords = [
  "not",
  "when",
  "time",
  "will",
  "report",
  "work",
  "sai",
  "just",
  "year",
  "first",
  "result",
  "look",
  "name",
  "even",
  "mai",
  "problem",
  "she",
  "dai",
  "case",
  "show",
  "two",
  "order",
  "includ",
  "issu",
  "accord",
  "down",
  "last",
  "that",
  "off",
  "like",
  "week",
  "caus",
  "suggest",
  "happen",
  "respons",
  "ask",
  "word",
  "need",
  "man",
  "back",
  "thing",
  "differ",
  "said",
  "inform",
  "servic",
  "stop",
  "set",
  "question",
  "help"
].concat(englishStopwords)

const Wordlist = ({content}) => {
  return (
    <>
      {content.map((value, index) => (
          <li key={uuid()}>{value[0]}: {value[1]}</li>
      ))}
    </>
  );
};

const WordCloudCell = ({wordCountsSorted, wordCloudOptions, wordCloudSize, wordCloud}) => {
  return (
    <Row>
      <Col xs={4}>
          <Wordlist content={wordCountsSorted} />
      </Col>
      <Col xs={8}>
        <ReactWordcloud
          options={wordCloudOptions}
          size={wordCloudSize}
          words={wordCloud}
        />
      </Col>
    </Row>
  )
}

export default class Authors extends Component {
  
  render() {

    const { data } = this.props;
    if (!data) {
      return null;
    }
    const {
      allMongodbAiidprodIncidents: {
        nodes
      }
    } = data;

    let wordCounts = {}
    nodes.forEach(element => {
      if (element["text"]) {
        let words = stopword.removeStopwords(element["text"].split(" "), customStopWords)
        for(let i=0; i<words.length; i++) {
          let word = stemmer(words[i].toLowerCase().replace(/\W/g, ''))
          if( word in wordCounts ) {
            wordCounts[word] += 1
          } else {
            wordCounts[word] = 1
          }
        }
      }
    })
    let wordCountsSorted = []
    for (var word in wordCounts) {
      if(wordCounts[word] > 99 && word.length > 2)
        wordCountsSorted.push([word, wordCounts[word]]);
    }
    wordCountsSorted.sort(function(a, b) {
        return b[1] - a[1];
    })
    const wordCloudOptions = {
      rotations: 3,
      rotationAngles: [-90, 0],
    }
    const wordCloudSize = [350, 350]
    let wordClouds = []
    const numWordClouds = 8
    const wordsPerCloud = 80
    for( var i = 0; i < numWordClouds; i++ ) {
      wordClouds.push([])
      for( var j = i * wordsPerCloud; j < ((i + 1) * wordsPerCloud); j++ ) {
        wordClouds[i].push({"text": wordCountsSorted[j][0], "value": wordCountsSorted[j][1]})
      }
    }

    return (
      <Layout {...this.props}>
        <Helmet>
          <title>Incident List</title>
        </Helmet>
        <div className={'titleWrapper'}>
          <StyledHeading>Word Counts</StyledHeading>
        </div>
        <StyledMainWrapper>
          <p className="paragraph">
            This is a list of the words in incident reports ranked by their counts.
            Common words (i.e., "stop words") are removed from the list, and the stems
            of the words are displayed rather than the conjugations found within the text.
            Words with fewer than 10 appearances and fewer than 3 letters are not included.
            If you would
            like to explore the contents of the reports, you
            should work through the
            <Link to="/about_apps/1-discover"> Discover app</Link>.
          </p>
          <Container>
            <ul>
              <WordCloudCell
                  wordCountsSorted={wordCountsSorted.slice(0,wordsPerCloud)}
                  wordCloudOptions={wordCloudOptions}
                  wordCloudSize={wordCloudSize}
                  wordCloud={wordClouds[0]} />
              <WordCloudCell
                  wordCountsSorted={wordCountsSorted.slice(wordsPerCloud, 2*wordsPerCloud)}
                  wordCloudOptions={wordCloudOptions}
                  wordCloudSize={wordCloudSize}
                  wordCloud={wordClouds[1]} />
              <WordCloudCell
                  wordCountsSorted={wordCountsSorted.slice(2*wordsPerCloud, 3*wordsPerCloud)}
                  wordCloudOptions={wordCloudOptions}
                  wordCloudSize={wordCloudSize}
                  wordCloud={wordClouds[2]} />
              <WordCloudCell
                  wordCountsSorted={wordCountsSorted.slice(3*wordsPerCloud, 4*wordsPerCloud)}
                  wordCloudOptions={wordCloudOptions}
                  wordCloudSize={wordCloudSize}
                  wordCloud={wordClouds[3]} />
              <WordCloudCell
                  wordCountsSorted={wordCountsSorted.slice(4*wordsPerCloud, 5*wordsPerCloud)}
                  wordCloudOptions={wordCloudOptions}
                  wordCloudSize={wordCloudSize}
                  wordCloud={wordClouds[4]} />
              <WordCloudCell
                  wordCountsSorted={wordCountsSorted.slice(5*wordsPerCloud, 6*wordsPerCloud)}
                  wordCloudOptions={wordCloudOptions}
                  wordCloudSize={wordCloudSize}
                  wordCloud={wordClouds[5]} />
              <WordCloudCell
                  wordCountsSorted={wordCountsSorted.slice(6*wordsPerCloud, 7*wordsPerCloud)}
                  wordCloudOptions={wordCloudOptions}
                  wordCloudSize={wordCloudSize}
                  wordCloud={wordClouds[6]} />
              <WordCloudCell
                  wordCountsSorted={wordCountsSorted.slice(7*wordsPerCloud, 8*wordsPerCloud)}
                  wordCloudOptions={wordCloudOptions}
                  wordCloudSize={wordCloudSize}
                  wordCloud={wordClouds[7]} />
            </ul>
          </Container>
        </StyledMainWrapper>
      </Layout>
    );
  }
}

export const pageQuery = graphql`
query WordCounts {
  allMongodbAiidprodIncidents {
    nodes {
      text
    }
  }
}
`;
