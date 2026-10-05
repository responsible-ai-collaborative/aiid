import { createContext } from 'react';

/**
 * The `distinct` search parameter of the Discover app.
 *
 * InstantSearch derives `uiState.configure` from the mounted <Configure>
 * widgets, and a widget's props win over whatever `setIndexUiState` put in
 * `uiState.configure`. The display options dropdown and the Clear Filters
 * button used to render their own <Configure> from a local copy of
 * `uiState.configure`; the copy that had not caught up yet could then
 * overwrite the new value, which instantsearch.js 4.114 exposed by replacing a
 * changed widget in place and reading the state back from every widget in
 * order (https://github.com/algolia/instantsearch/pull/7206).
 *
 * `distinct` is now owned by Discover.js, declared on its single <Configure>,
 * and changed by the controls through this context.
 */
const DiscoverConfigureContext = createContext({
  distinct: true,
  setDistinct: () => {},
});

export default DiscoverConfigureContext;
