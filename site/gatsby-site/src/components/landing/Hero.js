import React from 'react';
import { Trans } from 'react-i18next';

export default function Hero() {
  return (
    <div className="px-4 text-center mt-5 md:mt-4">
      <h1 className="mx-auto mb-2 md:mb-4 max-w-xl">
        <Trans ns="landing">
          <div
            className="
            text-2xl md:text-3xl 
            font-light 
            text-gray-800 dark:text-gray-200
          "
          >
            Welcome to the
          </div>
          <div
            className="
            text-4xl md:text-5xl
            font-extrabold 
            text-gray-900 dark:text-white
            tracking-tight leading-tight
          "
          >
            AI Incident Database
          </div>
        </Trans>
      </h1>
    </div>
  );
}
