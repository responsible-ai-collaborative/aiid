import Link from 'components/ui/Link';
import { useLocalization } from 'gatsby-theme-i18n';
import React from 'react';
import { Trans } from 'react-i18next';
import { Badge } from 'flowbite-react';

export default function TranslationBadge({ className = '', originalLanguage = '' }) {
  const { locale } = useLocalization();

  if (locale !== originalLanguage) {
    return (
      <div className={`inline-block ${className}`} data-cy="translation-badge">
        <Link to="/blog/multilingual-incident-reporting">
          <Badge>
            <Trans>AI Translated</Trans>
          </Badge>
        </Link>
      </div>
    );
  }

  return null;
}
