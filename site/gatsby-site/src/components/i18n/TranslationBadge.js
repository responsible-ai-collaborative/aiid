import Link from 'components/ui/Link';
import { useLocalization } from 'gatsby-theme-i18n';
import React from 'react';
import { Badge } from 'react-bootstrap';
import { Trans } from 'react-i18next';

export default function TranslationBadge({ className = '', originalLanguage = '' }) {
  const { locale } = useLocalization();

  if (locale !== originalLanguage) {
    return (
      <div className="bootstrap">
        <Link to="/blog/multilingual-incident-reporting">
          <Badge className={className} bg="secondary">
            <Trans>AI Translated</Trans>
          </Badge>
        </Link>
      </div>
    );
  }

  return null;
}
