import React from 'react';
import Layout from 'components/Layout';
import { StyledHeading } from 'components/styles/Docs';
import { Trans, useTranslation } from 'react-i18next';
import { LocalizedLink } from 'gatsby-theme-i18n';
import AiidHelmet from 'components/AiidHelmet';
import { gql, useQuery } from '@apollo/client';

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
      }
    }
  `);

  console.log(newsArticlesData);

  const newsArticles = loading ? [] : [...newsArticlesData?.candidates];

  console.log('newsArticles', newsArticles);

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
      <p>Sorted by textual similarity to existing reports in the database</p>
      <div className="tw-card-set">
        {loading && <p>Searching...</p>}
        {newsArticles
          .sort((b, a) => a.similarity - b.similarity)
          .map((newsArticle) => (
            <div className="tw-card tw-p-4" key={newsArticle.url}>
              <a href={newsArticle.url}>
                <h3 className="tw-text-xl">{newsArticle.title}</h3>
              </a>
              <p>
                <strong>Similarity</strong>:{' '}
                {newsArticle.similarity < 0.997 ? (
                  <span className="tw-text-yellow-500">Minimal</span>
                ) : newsArticle.similarity < 0.9975 ? (
                  <span className="tw-text-lime-500">Moderate</span>
                ) : (
                  <span className="tw-text-green-500">High</span>
                )}{' '}
                ({newsArticle.similarity})
              </p>
              <p>
                <strong>Matching Keywords</strong>:{' '}
                {newsArticle.matching_keywords.map((keyword) => keyword.trim()).join(', ')}
              </p>
              <LocalizedLink
                to={
                  '/apps/submit?' +
                  ['url', 'title', 'text']
                    .map((e) => `${e}=${encodeURIComponent(newsArticle[e])}`)
                    .join('&')
                }
                target="_blank"
              >
                <button className="tw-btn-primary tw-btn tw-mt-4">Submit</button>
              </LocalizedLink>
            </div>
          ))}
      </div>
    </Layout>
  );
};

export default NewsSearchPage;
