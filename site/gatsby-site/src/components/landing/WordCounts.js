import Wordlist from 'components/WordList';
import { Link } from 'gatsby';
import React from 'react';
import { Card } from 'react-bootstrap';

export default function WordCounts({ localWordCounts }) {
  return (
    <Card>
      <Card.Body>
        <Card.Title as="h2">Wordcounts</Card.Title>
        <Card.Text>
          These are the most common rooted and stemmed words across all incident reports. More
          details are available on its <Link to="/summaries/wordcounts">data summary page.</Link>
        </Card.Text>

        <Wordlist content={localWordCounts} />
      </Card.Body>
    </Card>
  );
}
