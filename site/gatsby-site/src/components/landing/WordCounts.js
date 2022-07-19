import Wordlist from 'components/WordList';
import { LocalizedLink } from 'gatsby-theme-i18n';
import React from 'react';
import { Card } from 'react-bootstrap';
import { Trans } from 'react-i18next';

export default function WordCounts({ localWordCounts }) {
  return (
    <Card>
      <Card.Body>
        <Card.Title as="h2">
          <Trans ns="landing">Wordcounts</Trans>
        </Card.Title>
        <Card.Text>
          <Trans i18nKey="wordcountsDescription" ns="landing">
            These are the most common rooted and stemmed words across all incident reports. More
            details are available on its{' '}
            <LocalizedLink to="/summaries/wordcounts">data summary page.</LocalizedLink>
          </Trans>
        </Card.Text>

        <Wordlist content={localWordCounts} />
      </Card.Body>
    </Card>
  );
}
