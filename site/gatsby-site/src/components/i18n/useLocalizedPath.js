import { useLocalization } from 'gatsby-theme-i18n';

export default function useLocalizedPath() {
  const { localizedPath, defaultLang, locale, prefixDefault } = useLocalization();

  return ({ path }) => localizedPath({ path, defaultLang, locale, prefixDefault });
}
