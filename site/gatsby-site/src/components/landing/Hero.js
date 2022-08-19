import React from 'react';
import { Trans } from 'react-i18next';

export default function Hero() {
  return (
    <div className="tw-px-4 tw-mt-2 tw-text-center">
      <h1 className="tw-font-bold">
        <Trans ns="landing">Welcome to the Artificial Intelligence Incident Database</Trans>
      </h1>
    </div>
  );
}
