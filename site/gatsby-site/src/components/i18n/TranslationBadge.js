import { useLocalization } from 'gatsby-theme-i18n';
import React from 'react';
import { Badge } from 'react-bootstrap';
import { Trans } from 'react-i18next';

export default function TranslationBadge({ className = '', originalLanguage = '' }) {
  const { locale } = useLocalization();

  if (locale !== originalLanguage) {
    return (
      <Badge className={className} bg="secondary">
        <Trans>AI Translated</Trans>
      </Badge>
    );
  }

  return null;
}
