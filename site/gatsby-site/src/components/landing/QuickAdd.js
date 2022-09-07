import React from 'react';
import QuickAddForm from 'components/forms/QuickAddForm';
import { Trans } from 'react-i18next';

export default function QuickAdd() {
  return (
    <>
      <h2 className="mb-4 text-3xl font-extrabold tracking-tight leading-none text-gray-900 md:text-4xl dark:text-white">
        <Trans ns="landing">Quick Add New Report URL</Trans>
      </h2>
      <div className="flex flex-col items-center p-4 bg-white rounded-lg border shadow-md md:flex-row dark:border-gray-700 dark:bg-gray-800 w-full">
        <QuickAddForm className="mt-3 w-full" />
      </div>
    </>
  );
}
