import { useLocalization } from 'gatsby-theme-i18n';
import { switchLocalizedPath } from '../../../i18n';

export default function useLocalizePath() {
  const { locale } = useLocalization();

  return ({ path, language = locale }) =>
    switchLocalizedPath({ currentLang: locale, newLang: language, path });
}
