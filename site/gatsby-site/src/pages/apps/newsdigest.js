import React, { useState, useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { LocalizedLink } from 'plugins/gatsby-theme-i18n';
import { gql, useQuery, useMutation } from '@apollo/client';
import { Card, Badge, Dropdown } from 'flowbite-react';
import { format, parse } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlusCircle,
  faTrash,
  faArrowUp,
  faBuilding,
  faTag,
  faBolt,
} from '@fortawesome/free-solid-svg-icons';
import HeadContent from 'components/HeadContent';
import { useUserContext } from 'contexts/userContext';
import CardSkeleton from 'elements/Skeletons/Card';
import { useLocalization } from 'plugins/gatsby-theme-i18n';
import useLocalizePath from 'components/i18n/useLocalizePath';

export default function NewsSearchPage() {
  const { t } = useTranslation(['submit']);

  const { isRole } = useUserContext();

  const [newsArticleUrls, setNewsArticleUrls] = useState([]);

  const { data: newsArticlesData, loading } = useQuery(
    gql`
      query NewsArticles($query: CandidateQueryInput!) {
        candidates(query: $query, limit: 9999) {
          title
          url
          similarity
          matching_keywords
          matching_harm_keywords
          matching_entities
          date_published
          dismissed
        }
      }
    `,
    {
      variables: {
        query: {
          match: true,
          date_published_in: Array(14)
            .fill()
            .map((e, i) =>
              new Date(
                new Date().getTime() - 86400000 * i // i days ago
              )
                .toISOString()
                .slice(0, 10)
            ),
        },
      },
    }
  );

  const { data: submissionsData } = useQuery(
    gql`
      query ExistingSubmissions($filter: SubmissionFilterType!) {
        submissions(filter: $filter) {
          url
        }
      }
    `,
    {
      variables: {
        filter: {
          url: {
            IN: newsArticleUrls,
          },
        },
      },
    }
  );

  const { data: reportsData } = useQuery(
    gql`
      query ExistingReports($filter: ReportFilterType!) {
        reports(filter: $filter) {
          report_number
          url
        }
      }
    `,
    {
      variables: {
        filter: {
          url: {
            IN: newsArticleUrls,
          },
        },
      },
    }
  );

  const [updateCandidate] = useMutation(gql`
    mutation UpdateCandidate($query: CandidateQueryInput!, $set: CandidateUpdateInput!) {
      updateOneCandidate(query: $query, set: $set) {
        url
      }
    }
  `);

  let newsArticles = (newsArticlesData?.candidates ? [...newsArticlesData?.candidates] : []).map(
    (newsArticle) => {
      const ageInMillis = parse(newsArticle.date_published, 'yyyy-MM-dd', new Date()).getTime();

      const ageInDays = millisToDays(new Date().getTime() - ageInMillis);

      const keywordsCount = newsArticle?.matching_keywords?.length || 0;

      const harmKeywordsCount = newsArticle?.matching_harm_keywords?.length || 0;

      return { ...newsArticle, ageInDays, keywordsCount, harmKeywordsCount };
    }
  );

  const [similarityMean, similarityStdDev] = stats(newsArticles.map((e) => e.similarity));

  newsArticles = newsArticles.map((newsArticle) => ({
    ...newsArticle,
    similaritySigma: (newsArticle.similarity - similarityMean) / similarityStdDev,
  }));

  newsArticles = newsArticles.map((newsArticle) => {
    const intrinsicRanking = getIntrinsicRanking(newsArticle);

    return {
      ...newsArticle,
      intrinsicRanking,
      ranking: intrinsicRanking / newsArticle.ageInDays,
    };
  });

  useEffect(() => {
    setNewsArticleUrls(newsArticles.map((newsArticle) => newsArticle.url));
  }, [newsArticlesData]);

  const existingSubmissions = (submissionsData?.submissions || []).map(
    (submission) => submission.url
  );

  const existingReports = (reportsData?.reports || []).map((report) => report.url);

  const [dismissedArticles, setDismissedArticles] = useState({});

  const displayedArticles = newsArticles.filter((newsArticle) => {
    const notDismissed =
      (dismissedArticles[newsArticle.url] == undefined && !newsArticle.dismissed) ||
      dismissedArticles[newsArticle.url] === false;

    return (
      notDismissed &&
      newsArticle.ageInDays < 30 &&
      newsArticle.intrinsicRanking > 0.4 &&
      !existingReports.includes(newsArticle.url) &&
      newsArticle.similaritySigma > -1
    );
  });

  const displayedDismissed = newsArticles.filter(
    (newsArticle) =>
      (newsArticle.dismissed && dismissedArticles[newsArticle.url] === undefined) ||
      dismissedArticles[newsArticle.url] === true
  );

  const title = t('Related News Digest');

  return (
    <>
      <div className={'titleWrapper'}>
        <h1>
          <Trans>{title}</Trans>
        </h1>
      </div>
      <p>
        <Trans i18nKey={'newsDigestDescription'}>
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
      <div
        data-cy="results"
        style={{ gridTemplateColumns: 'repeat( auto-fit, minmax(28rem, 1fr) )' }}
        className="flex flex-col lg:grid gap-4 bg-gray-100 border-1 border-gray-200 rounded shadow-inner p-4"
      >
        {loading &&
          Array(24)
            .fill()
            .map((e, i) => (
              <CardSkeleton
                image={false}
                key={i}
                maxWidthSmall={false}
                lines={8}
                className="bg-white"
              />
            ))}
        {!loading && displayedArticles.length == 0 && <p>No results</p>}
        {displayedArticles
          .sort((a, b) => b.ranking - a.ranking)
          .map((newsArticle) => (
            <CandidateCard
              key={newsArticle.url}
              {...{
                newsArticle,
                updateCandidate,
                setDismissedArticles,
                existingSubmissions,
              }}
            />
          ))}
      </div>
      {displayedDismissed.length > 0 && isRole('incident_editor') && (
        <details className="mt-4">
          <summary data-cy="dismissed-summary" className="mb-4">
            Dismissed News Reports
          </summary>
          <div
            data-cy="dismissed"
            style={{ gridTemplateColumns: 'repeat( auto-fit, minmax(28rem, 1fr) )' }}
            className="flex flex-col lg:grid gap-4 bg-gray-100 border-1 border-gray-200 rounded shadow-inner p-4"
          >
            {displayedDismissed.map((newsArticle) => (
              <CandidateCard
                dismissed={true}
                key={newsArticle.url}
                {...{
                  newsArticle,
                  updateCandidate,
                  setDismissedArticles,
                  existingSubmissions,
                }}
              />
            ))}
          </div>
        </details>
      )}
    </>
  );
}

function CandidateCard({
  newsArticle,
  setDismissedArticles,
  updateCandidate,
  dismissed = false,
  existingSubmissions,
}) {
  const { isRole } = useUserContext();

  const localizePath = useLocalizePath();

  const { locale } = useLocalization();

  let date;

  try {
    date = format(parse(newsArticle.date_published, 'yyyy-MM-dd', new Date()), 'yyyy-MM-dd');
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
      className="gap-0 max-w-full"
      key={newsArticle.url}
    >
      <div>
        <span className="float-right pt-2" data-cy="candidate-dropdown">
          {(isRole('incident_editor') || !existingSubmissions.includes(newsArticle.url)) && (
            <Dropdown inline label="">
              {!existingSubmissions.includes(newsArticle.url) && (
                <Dropdown.Item
                  onClick={() => {
                    window.open(
                      localizePath({
                        language: locale,
                        path:
                          '/apps/submit/?' +
                          ['url', 'title', 'text']
                            .map((e) => `${e}=${encodeURIComponent(newsArticle[e])}`)
                            .join('&'),
                      })
                    );
                  }}
                >
                  <FontAwesomeIcon
                    data-cy="submit-icon"
                    icon={faPlusCircle}
                    className="pointer fa mr-1"
                    fixedWidth
                  />
                  Submit
                </Dropdown.Item>
              )}
              {isRole('incident_editor') &&
                (dismissed ? (
                  <Dropdown.Item
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
                    <FontAwesomeIcon
                      data-cy="restore-icon"
                      icon={faArrowUp}
                      className="pointer fa mr-1"
                      fixedWidth
                    />
                    Restore
                  </Dropdown.Item>
                ) : (
                  <Dropdown.Item
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
                    <FontAwesomeIcon
                      data-cy="dismiss-icon"
                      icon={faTrash}
                      className="pointer fa mr-1"
                      fixedWidth
                    />
                    Dismiss
                  </Dropdown.Item>
                ))}
            </Dropdown>
          )}
        </span>
        <a href={newsArticle.url}>
          <h3 className="text-xl mt-0 mb-0">{newsArticle.title}</h3>
        </a>
        <div className="text-lg text-gray-600 mb-3 mt-1">
          {date}
          {domain && date && <> • </>}
          {domain}
        </div>
        <div className="flex flex-wrap gap-2">
          <span>
            {newsArticle.similaritySigma < 0 ? (
              <Badge color="warning" title={'cosine similarity: ' + greatestSimilarity.similarity}>
                Weak match
              </Badge>
            ) : newsArticle.similaritySigma < 1.5 ? (
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
            <span key={keyword}>
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
    </Card>
  );
}

function getIntrinsicRanking(newsArticle) {
  const s = newsArticle.similaritySigma;

  const k = newsArticle.keywordsCount;

  const h = newsArticle.harmKeywordsCount;

  //         We take the square root of the keyword
  //         counts so that the bonus for having more
  //         keywords diminishes the more there are.
  //         Having 9 of each type of keyword (rare)
  //         would be equivalent to having a 2 sigma
  //         ranking cosine similarity.
  //                   |                        |
  return 3 ** s * Math.sqrt(k) * Math.max(Math.sqrt(h), 0.25);
  //       |                                            |
  // Since s is in stdevs, the range      In particular, articles with
  // is about [-2, 2]. With 3**s, the     one harm keyword should be
  // multiplier range is [1/9, 9].        substantially higher-ranked
  //                                      than those with none (4x).
}

var millisToDays = (millis) => millis / (1000 * 60 * 60 * 24);

var mean = (list) => list.reduce((sum, entry) => sum + entry, 0) / list.length;

var stdDev = (list, mean) =>
  list.reduce((sum, entry) => sum + Math.abs(entry - mean), 0) / list.length;

var stats = (list) => {
  const m = mean(list);

  return [m, stdDev(list, m)];
};

export const Head = (props) => {
  const {
    location: { pathname },
  } = props;

  const { t } = useTranslation();

  const title = t('Related News Digest');

  const metaDescription = t(
    'This summary features AI-related news, identified and matched to our database via NLP for textual similarity, including potential incidents and highlighted harm keywords.'
  );

  return <HeadContent path={pathname} metaTitle={title} metaDescription={metaDescription} />;
};
