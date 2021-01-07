import * as React from 'react';
import { ThemeProvider as EmotionThemeProvider } from 'emotion-theming';
import Header from './Header';

const fonts = {
  mono: '"SF Mono", "Roboto Mono", Menlo, monospace',
};

export default function ThemeProvider({ children, theme = {}, location }) {
  return (
    <div>
      <Header location={location} />
      <EmotionThemeProvider theme={{ fonts, ...theme }}>{children}</EmotionThemeProvider>
    </div>
  );
}
