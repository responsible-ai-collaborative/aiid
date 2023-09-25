import decodeQuery from './decodeQuery';

export default function getInitialQuery(location) {
  const params = new URLSearchParams(location.search);

  const query = params.get('filters');

  if (query) {
    const result = decodeQuery(query);

    return { filters: result };
  }

  return { filters: [] };
}
