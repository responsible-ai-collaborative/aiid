import { MDXProvider } from '@mdx-js/react';

import { UserContextProvider } from 'contexts/userContext';
import ThemeProvider from 'components/theme/themeProvider';
import mdxComponents from 'components/mdxComponents';

// Wraps every page in a component
const wrapWithProvider = ({ element }) => {
  return (
    <ThemeProvider>
      <MDXProvider components={mdxComponents}>
        <UserContextProvider>{element}</UserContextProvider>
      </MDXProvider>
    </ThemeProvider>
  );
};

export default wrapWithProvider;
