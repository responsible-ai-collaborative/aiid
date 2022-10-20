export default function NewsSearchPage(props) {
  const { t } = useTranslation(['submit']);

  const { data: newsArticlesData, loading } = useQuery(gql`
    query NewsArticles {
      candidates(query: { match: true }, limit: 9999) {
        title
        url
        similarity
        matching_keywords
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
        (new Date().getTime() -
          parse(newsArticle.date_published, 'yyyy-MM-dd', new Date()).getTime()) /
          (1000 * 60 * 60 * 24) <
          30) &&
      !existingSubmissions.includes(newsArticle.url) &&
      !existingReports.includes(newsArticle.url)
  );

  const displayedDismissed = newsArticles.filter(
    (newsArticle) =>
      (newsArticle.dismissed && dismissedArticles[newsArticle.url] === undefined) ||
      dismissedArticles[newsArticle.url] === true
  );

  return (
    <Layout {...props}>
      <AiidHelmet>
        <title>{t('News Search')}</title>
      </AiidHelmet>
      <div className={'titleWrapper'}>
        <StyledHeading>
          <Trans>News Search</Trans>
        </StyledHeading>
      </div>
      <p>
        Stories from around the web matched by keywords and sorted by textual similarity to existing
        reports in the database
      </p>
      <div className="tw-card-set">
        {loading && <p>Searching...</p>}
        {!loading && displayedArticles.length == 0 && <p>No results</p>}
        {displayedArticles
          .sort((b, a) => a.similarity - b.similarity)
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
          <summary>Dismissed News Reports</summary>
          <div className="tw-card-set mt-2">
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
  let source_domain;

  try {
    source_domain = new URL(newsArticle.url).host.replace('www.', '');
  } catch (e) {
    source_domain = null;
  }

  const title = newsArticle.title.replace(/ [|•·] .*$/, '');

  return (
    <IncidentReportCard
      report={newsArticle}
      text={false}
      dateFormat="MMM d"
      {...{ source_domain, title }}
    >
      <CardFooter className="flex-wrap mb-4">
        <span className="mb-1 mr-1">
          {newsArticle.similarity < 0.997 ? (
            <Badge color="warning" title={'cosine similarity: ' + newsArticle.similarity}>
              Weak match
            </Badge>
          ) : newsArticle.similarity < 0.9975 ? (
            <Badge color="success" title={'cosine similarity: ' + newsArticle.similarity}>
              Match
            </Badge>
          ) : (
            <Badge color="success" title={'cosine similarity: ' + newsArticle.similarity}>
              Strong match
            </Badge>
          )}{' '}
        </span>
        {newsArticle.matching_keywords.map((keyword) => (
          <span className="inline-block mr-1 mb-1" key={keyword}>
            <Badge>{keyword}</Badge>
          </span>
        ))}
      </CardFooter>
      <CardFooter className="mt-auto flex-wrap">
        {dismissed ? (
          <Button
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
          to={
            '/apps/submit?' +
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
      </CardFooter>
    </IncidentReportCard>
  );
}

import React, { useState } from 'react';
import Layout from 'components/Layout';
import { StyledHeading } from 'components/styles/Docs';
import { Trans, useTranslation } from 'react-i18next';
import { LocalizedLink } from 'gatsby-theme-i18n';
import AiidHelmet from 'components/AiidHelmet';
import { gql, useQuery, useMutation } from '@apollo/client';
import { Button, Badge } from 'flowbite-react';
import { parse } from 'date-fns';
import { faPlusCircle, faTrash, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IncidentReportCard, { CardFooter } from 'components/IncidentReportCard';
