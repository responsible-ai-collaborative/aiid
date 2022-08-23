import React from 'react';
import { Trans } from 'react-i18next';

export default function Hero() {
  return (
    <div className="px-4 tw-mt-2 text-center">
      <h1 className="font-bold">
        <Trans ns="landing">Welcome to the Artificial Intelligence Incident Database</Trans>
      </h1>
    </div>
  );
}
