import React from 'react';
import Layout from 'components/Layout';
import { StyledHeading } from 'components/styles/Docs';
import { Trans, useTranslation } from 'react-i18next';
import { LocalizedLink } from 'gatsby-theme-i18n';
import AiidHelmet from 'components/AiidHelmet';
import { gql, useQuery } from '@apollo/client';
import { Card, Button, Badge } from 'flowbite-react';
import { format, parse } from 'date-fns';

const NewsSearchPage = (props) => {
  const { t } = useTranslation(['submit']);

  const { data: newsArticlesData, loading } = useQuery(gql`
    query NewsArticles {
      candidates(query: { match: true }) {
        title
        url
        similarity
        matching_keywords
        text
        date_published
      }
    }
  `);

  const newsArticles = loading ? [] : [...newsArticlesData?.candidates];

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
        {newsArticles
          .filter(
            (newsArticle) =>
              !newsArticle.date_published ||
              (new Date().getTime() -
                parse(newsArticle.date_published, 'yyyy-MM-dd', new Date()).getTime()) /
                (1000 * 60 * 60 * 24) <
                30
          )
          .sort((b, a) => a.similarity - b.similarity)
          .map((newsArticle) => (
            <Card
              style={{ justifyContent: 'flex-start' }}
              className="gap-0"
              key={newsArticle.incident_id}
            >
              <div>
                <a href={newsArticle.url}>
                  <h3 className="text-xl mt-0 mb-0">{newsArticle.title}</h3>
                </a>
                <div className="text-lg text-gray-600 my-2">
                  {format(
                    parse(newsArticle.date_published, 'yyyy-MM-dd', new Date()),
                    'MMM d, yyyy'
                  )}
                </div>
                <div className="flex">
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
                  {newsArticle.matching_keywords.map((keyword) => (
                    <span className="inline-block ml-1 mr-1" key={keyword}>
                      <Badge>{keyword}</Badge>
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-auto flex justify-end">
                <LocalizedLink
                  to={
                    '/apps/submit?' +
                    ['url', 'title', 'text']
                      .map((e) => `${e}=${encodeURIComponent(newsArticle[e])}`)
                      .join('&')
                  }
                  target="_blank"
                  className="inline"
                >
                  <Button>Submit</Button>
                </LocalizedLink>
              </div>
            </Card>
          ))}
      </div>
    </Layout>
  );
};

export default NewsSearchPage;
