import React from 'react';
import { Trans } from 'react-i18next';

export default function Hero() {
  return (
    <div className="px-4 mt-2 text-center">
      <h1
        className="
            my-4 mx-auto font-extrabold tracking-tight leading-tight text-gray-900 
            text-4xl max-w-xl
            md:max-w-2xl md:text-5xl md:leading-tight
            dark:text-white
        "
      >
        <Trans ns="landing">Welcome to the Artificial Intelligence Incident Database</Trans>
      </h1>
    </div>
  );
}
