import decodeQuery from './decodeQuery';

export default function getInitialQuery(location) {
  const { filters } = decodeQuery(location.search.substr(1));

  if (!filters) {
    return { filters: [] };
  }

  return { filters };
}
