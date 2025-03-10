import Link from 'components/ui/Link';
import { useLocalization } from 'plugins/gatsby-theme-i18n';
import React from 'react';
import { Trans } from 'react-i18next';
import { Badge } from 'components/Flowbite';

export default function TranslationBadge({ className = '', originalLanguage = '' }) {
  const { locale } = useLocalization();

  if (locale !== originalLanguage) {
    return (
      <div className={`inline-block ${className || ''}`} data-cy="translation-badge">
        <Link to="/blog/multilingual-incident-reporting" className="hover:no-underline">
          <Badge>
            <Trans>AI Translated</Trans>
          </Badge>
        </Link>
      </div>
    );
  }

  return null;
}
