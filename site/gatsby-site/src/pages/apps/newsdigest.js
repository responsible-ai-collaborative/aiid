import React, { useState } from 'react';
import Layout from 'components/Layout';
import { StyledHeading } from 'components/styles/Docs';
import { Trans, useTranslation } from 'react-i18next';
import { LocalizedLink } from 'gatsby-theme-i18n';
import AiidHelmet from 'components/AiidHelmet';
import { gql, useQuery, useMutation } from '@apollo/client';
import { Card, Button, Badge } from 'flowbite-react';
import { format, parse } from 'date-fns';
import {
  faPlusCircle,
  faTrash,
  faArrowUp,
  faBuilding,
  faTag,
  faBolt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function NewsSearchPage(props) {
  const { t } = useTranslation(['submit']);

  const { data: newsArticlesData, loading } = useQuery(gql`
    query NewsArticles {
      candidates(query: { match: true }, limit: 9999) {
        title
        url
        similarity
        classification_similarity {
          classification
          similarity
        }
        matching_keywords
        matching_harm_keywords
        matching_entities
        text
        date_published
        dismissed
      }
    }
  `);

  const newsArticles = newsArticlesData?.candidates ? [...newsArticlesData?.candidates] : [];

  const newsArticleUrls = newsArticles.map((newsArticle) => newsArticle.url);

  const { data: submissionsData } = useQuery(
    gql`
      query ExistingSubmissions($query: SubmissionQueryInput!) {
        submissions(query: $query, limit: 9999) {
          url
        }
      }
    `,
    { variables: { query: { url_in: newsArticleUrls } } }
  );

  const { data: reportsData } = useQuery(
    gql`
      query ExistingReports($query: ReportQueryInput!) {
        reports(query: $query, limit: 9999) {
          report_number
          url
        }
      }
    `,
    { variables: { query: { url_in: newsArticleUrls } } }
  );

  const existingSubmissions = (submissionsData?.submissions || []).map(
    (submission) => submission.url
  );

  const existingReports = (reportsData?.reports || []).map((report) => report.url);

  const [updateCandidate] = useMutation(gql`
    mutation UpdateCandidate($query: CandidateQueryInput!, $set: CandidateUpdateInput!) {
      updateOneCandidate(query: $query, set: $set) {
        url
      }
    }
  `);

  const [dismissedArticles, setDismissedArticles] = useState({});

  const displayedArticles = newsArticles.filter(
    (newsArticle) =>
      ((dismissedArticles[newsArticle.url] == undefined && !newsArticle.dismissed) ||
        dismissedArticles[newsArticle.url] === false) &&
      (!newsArticle.date_published ||
        millisToDays(
          new Date().getTime() -
            parse(newsArticle.date_published, 'yyyy-MM-dd', new Date()).getTime()
        ) < 30) &&
      !existingSubmissions.includes(newsArticle.url) &&
      !existingReports.includes(newsArticle.url)
  );

  const displayedDismissed = newsArticles.filter(
    (newsArticle) =>
      (newsArticle.dismissed && dismissedArticles[newsArticle.url] === undefined) ||
      dismissedArticles[newsArticle.url] === true
  );

  const title = t('Related News Digest');

  return (
    <Layout {...props}>
      <AiidHelmet>
        <title>{title}</title>
      </AiidHelmet>
      <div className={'titleWrapper'}>
        <StyledHeading>
          <Trans>{title}</Trans>
        </StyledHeading>
      </div>
      <p>
        <Trans>
          This digest shows news stories from around the web matching a set of AI-related{' '}
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
            <FontAwesomeIcon icon={faTag} className="pointer fa mr-1" fixedWidth />
            keywords
          </span>
          . These stories are{' '}
          <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900">
            match
          </span>
          ed to reports in the database according to textual similarity as identified by an{' '}
          <LocalizedLink to="/blog/using-ai-to-connect-ai-incidents">NLP system</LocalizedLink>.
          Also shown are mentioned{' '}
          <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
            <FontAwesomeIcon icon={faBuilding} className="pointer fa mr-1" fixedWidth />
            entities
          </span>{' '}
          <LocalizedLink to="/entities">in the database</LocalizedLink> and keywords related to{' '}
          <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900">
            <FontAwesomeIcon icon={faBolt} className="pointer fa mr-1" fixedWidth />
            harm
          </span>
          . Some of the stories below may qualify as incident reports and can be submitted to the
          database. However, the majority are simply AI-related.
        </Trans>
      </p>
      <div data-cy="results" className="tw-card-set">
        {loading && <p>Searching...</p>}
        {!loading && displayedArticles.length == 0 && <p>No results</p>}
        {displayedArticles
          .sort((a, b) => ranking(b) - ranking(a))
          .map((newsArticle) => (
            <CandidateCard
              newsArticle={newsArticle}
              setDismissedArticles={setDismissedArticles}
              updateCandidate={updateCandidate}
              key={newsArticle.url}
            />
          ))}
      </div>
      {displayedDismissed.length > 0 && (
        <details>
          <summary data-cy="dismissed-summary">Dismissed News Reports</summary>
          <div data-cy="dismissed" className="tw-card-set mt-2">
            {displayedDismissed.map((newsArticle) => (
              <CandidateCard
                newsArticle={newsArticle}
                updateCandidate={updateCandidate}
                setDismissedArticles={setDismissedArticles}
                dismissed={true}
                key={newsArticle.url}
              />
            ))}
          </div>
        </details>
      )}
    </Layout>
  );
}

function CandidateCard({ newsArticle, setDismissedArticles, updateCandidate, dismissed = false }) {
  let date;

  try {
    date = format(parse(newsArticle.date_published, 'yyyy-MM-dd', new Date()), 'MMM d');
  } catch (e) {
    date = null;
  }
  let domain;

  try {
    domain = new URL(newsArticle.url).host.replace('www.', '');
  } catch (e) {
    domain = null;
  }

  const generalSimilarity = { classification: 'General', similarity: newsArticle.similarity };

  const similarities = [generalSimilarity].concat(newsArticle.classification_similarity || []);

  let greatestSimilarity = similarities.sort((a, b) => b.similarity - a.similarity)[0];

  // Use general match unless the match for a classification is substantially higher
  if (greatestSimilarity.similarity - generalSimilarity.similarity < 0.001) {
    greatestSimilarity = generalSimilarity;
  }

  return (
    <Card
      data-cy="candidate-card"
      data-id={newsArticle.url}
      style={{ justifyContent: 'flex-start' }}
      className="gap-0"
      key={newsArticle.url}
    >
      <div>
        <a href={newsArticle.url}>
          <h3 className="text-xl mt-0 mb-0">{newsArticle.title.replace(/\s(-|\|).*/g, '')}</h3>
        </a>
        <div className="text-lg text-gray-600 mb-3 mt-1">
          {date}
          {domain && date && <> • </>}
          {domain}
        </div>
        <div className="flex flex-wrap">
          <span className="mb-1 mr-1">
            {greatestSimilarity.similarity < 0.997 ? (
              <Badge color="warning" title={'cosine similarity: ' + greatestSimilarity.similarity}>
                Weak match
              </Badge>
            ) : greatestSimilarity.similarity < 0.9975 ? (
              <Badge color="success" title={'cosine similarity: ' + greatestSimilarity.similarity}>
                Match
              </Badge>
            ) : (
              <Badge color="success" title={'cosine similarity: ' + greatestSimilarity.similarity}>
                Strong match
              </Badge>
            )}{' '}
          </span>
          {newsArticle.matching_keywords.map((keyword) => (
            <span className="inline-block mr-1 mb-1" key={keyword}>
              <Badge>
                <FontAwesomeIcon icon={faTag} className="pointer fa mr-1" fixedWidth />
                {keyword}
              </Badge>
            </span>
          ))}
          {newsArticle.matching_harm_keywords &&
            newsArticle.matching_harm_keywords.map((keyword) => (
              <span className="inline-block mr-1 mb-1" key={keyword}>
                <Badge color="failure">
                  <FontAwesomeIcon icon={faBolt} className="pointer fa mr-1" fixedWidth />
                  {keyword}
                </Badge>
              </span>
            ))}
          {newsArticle.matching_entities &&
            newsArticle.matching_entities.map((entity) => (
              <span className="inline-block mr-1 mb-1" key={entity}>
                <LocalizedLink to={'/entities/' + entity.toLowerCase().split(' ').join('-')}>
                  <Badge color="gray">
                    <FontAwesomeIcon icon={faBuilding} className="pointer fa mr-1" fixedWidth />
                    {entity}
                  </Badge>
                </LocalizedLink>
              </span>
            ))}
        </div>
      </div>
      {greatestSimilarity != generalSimilarity && (
        <div>
          <strong>Matching classification</strong>: {greatestSimilarity.classification}
        </div>
      )}
      <div className="mt-auto flex">
        {dismissed ? (
          <Button
            data-cy="restore-button"
            color="light"
            onClick={() => {
              setDismissedArticles((dismissedArticles) => {
                const updatedValue = { ...dismissedArticles };

                updatedValue[newsArticle.url] = false;
                return updatedValue;
              });
              updateCandidate({
                variables: {
                  query: { url: newsArticle.url },
                  set: { dismissed: false },
                },
              });
            }}
          >
            <FontAwesomeIcon icon={faArrowUp} className="pointer fa mr-1" fixedWidth />
            Restore
          </Button>
        ) : (
          <Button
            data-cy="dismiss-button"
            color="light"
            onClick={() => {
              setDismissedArticles((dismissedArticles) => {
                const updatedValue = { ...dismissedArticles };

                updatedValue[newsArticle.url] = true;
                return updatedValue;
              });
              updateCandidate({
                variables: {
                  query: { url: newsArticle.url },
                  set: { dismissed: true },
                },
              });
            }}
          >
            <FontAwesomeIcon icon={faTrash} className="pointer fa mr-1" fixedWidth />
            Dismiss
          </Button>
        )}
        <LocalizedLink
          data-cy="submit-button"
          to={
            '/apps/submit/?' +
            ['url', 'title', 'text']
              .map((e) => `${e}=${encodeURIComponent(newsArticle[e])}`)
              .join('&')
          }
          target="_blank"
          className="inline ml-1"
        >
          <Button color="light">
            <FontAwesomeIcon icon={faPlusCircle} className="pointer fa mr-1" fixedWidth />
            Submit
          </Button>
        </LocalizedLink>
      </div>
    </Card>
  );
}

function ranking(newsArticle) {
  const s = (newsArticle.similarity - 0.99) / 0.01; // Similarity

  const k = newsArticle.matching_keywords?.length || 1; // AI Keywords

  const h = newsArticle.matching_harm_keywords?.length || 0; // Harm Keywords

  const a = millisToDays(
    // Age
    new Date().getTime() - parse(newsArticle.date_published, 'yyyy-MM-dd', new Date()).getTime()
  );

  return (s * (k + 2 * h)) / a;
}

function millisToDays(millis) {
  return millis / (1000 * 60 * 60 * 24);
}
