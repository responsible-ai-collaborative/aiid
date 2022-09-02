import React from 'react';
import { Trans } from 'react-i18next';

export default function Hero() {
  return (
    <div className="px-4 mt-2 text-center">
      <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl dark:text-white">
        <Trans ns="landing">Welcome to the Artificial Intelligence Incident Database</Trans>
      </h1>
    </div>
  );
}
