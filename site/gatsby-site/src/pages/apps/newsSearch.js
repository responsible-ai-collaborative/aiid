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
          .sort((b, a) => a.similarity - b.similarity)
          .map((newsArticle) => (
            <div className="tw-card p-4" key={newsArticle.url}>
              <a href={newsArticle.url}>
                <h3 className="text-xl">{newsArticle.title}</h3>
              </a>
              <p>
                <strong>Similarity</strong>:{' '}
                {newsArticle.similarity < 0.997 ? (
                  <span className="text-yellow-500">Minimal</span>
                ) : newsArticle.similarity < 0.9975 ? (
                  <span className="text-lime-500">Moderate</span>
                ) : (
                  <span className="text-green-500">High</span>
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
                <button className="btn-primary btn mt-4">Submit</button>
              </LocalizedLink>
            </div>
          ))}
      </div>
    </Layout>
  );
};

export default NewsSearchPage;
