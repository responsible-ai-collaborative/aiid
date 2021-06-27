import React from 'react';
import { MDXProvider } from '@mdx-js/react';

import { UserContextProvider } from 'contexts/userContext';
import ThemeProvider from 'components/theme/themeProvider';
import mdxComponents from 'components/mdxComponents';

export default function wrapWithProvider({ children }) {
  return (
    <ThemeProvider>
      <MDXProvider components={mdxComponents}>
        <UserContextProvider>{children}</UserContextProvider>
      </MDXProvider>
    </ThemeProvider>
  );
}
