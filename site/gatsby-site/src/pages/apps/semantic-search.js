import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { Trans, useTranslation } from 'react-i18next';
import { Button, Spinner, TextInput } from 'flowbite-react';
import HeadContent from '../../components/HeadContent';
import { ApiAccessGate } from '../../components/ui/ApiLoginRequired';
import SemanticSearchTable from '../../components/semanticSearch/SemanticSearchTable';
import ExcelExport from '../../components/semanticSearch/ExcelExport';
import { SEMANTIC_SEARCH } from '../../graphql/semanticSearch';

const exampleQueries = [
  'deepfake related incidents',
  'facial recognition leading to a wrongful arrest',
  'autonomous vehicle crashes involving pedestrians',
];

/**
 * Searches incidents by meaning using stored incident embeddings. Forms and example buttons share
 * the same execution path, and Apollo's cache answers a repeated query without another request.
 */
export default function SemanticSearchPage() {
  const { t } = useTranslation();

  const [input, setInput] = useState('');

  const [submitted, setSubmitted] = useState('');

  const [search, { data, loading, error }] = useLazyQuery(SEMANTIC_SEARCH);

  const response = data?.semanticSearch;

  const results = response?.status === 'OK' ? response.results : [];

  const runSearch = (value) => {
    const query = value.trim();

    if (!query) return;

    setInput(query);
    setSubmitted(query);
    search({ variables: { query } });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    runSearch(input);
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold mb-2">
        <Trans>Semantic Search</Trans>
      </h1>
      <p className="mb-4 text-gray-600">
        <Trans>
          Describe what happened in your own words to list the incidents that match it most closely.
        </Trans>
      </p>

      {/* The search reads through the API, which requires a logged-in, unblocked account.
          SEE: server/apiAccess.ts */}
      <ApiAccessGate>
        <div className="flex flex-wrap items-center gap-2 mb-4" data-cy="semantic-search-examples">
          <span className="text-sm text-gray-600">
            <Trans>Try an example:</Trans>
          </span>
          {exampleQueries.map((query, index) => (
            <button
              key={query}
              type="button"
              disabled={loading}
              onClick={() => runSearch(query)}
              className="rounded-full border border-blue-300 px-3 py-1 text-sm text-blue-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              data-cy={`semantic-search-example-${index + 1}`}
            >
              {t(query)}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="flex gap-2 mb-4" data-cy="semantic-search-form">
          <TextInput
            className="flex-1"
            value={input}
            maxLength={500}
            onChange={(event) => setInput(event.target.value)}
            placeholder={t('Describe an incident in your own words')}
            data-cy="semantic-search-input"
          />
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            data-cy="semantic-search-submit"
          >
            <Trans>Search</Trans>
          </Button>
        </form>

        {loading && <Spinner />}

        {!loading && (error || response?.status === 'UNAVAILABLE') && (
          <p className="text-red-700" data-cy="semantic-search-unavailable">
            <Trans>Search is unavailable right now. Please try again later.</Trans>
          </p>
        )}

        {!loading && response?.status === 'QUOTA_EXHAUSTED' && (
          <p className="text-amber-700" data-cy="semantic-search-limited">
            <Trans>The search limit has been reached for now. Please try again later.</Trans>
          </p>
        )}

        {!loading && response?.status === 'OK' && results.length === 0 && (
          <p data-cy="semantic-search-empty">
            <Trans>No incidents closely match that description.</Trans>
          </p>
        )}

        {!loading && results.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-2">
              <span data-cy="semantic-search-count">
                {t('{{count}} matching incidents', { count: results.length })}
              </span>
              <ExcelExport results={results} query={submitted} />
            </div>
            <SemanticSearchTable results={results} />
          </>
        )}
      </ApiAccessGate>
    </div>
  );
}

export const Head = (props) => {
  const {
    location: { pathname },
  } = props;

  const { t } = useTranslation();

  return (
    <HeadContent
      path={pathname}
      metaTitle={t('Semantic Search')}
      metaDescription={t('Find incidents that match a description written in your own words.')}
    />
  );
};
