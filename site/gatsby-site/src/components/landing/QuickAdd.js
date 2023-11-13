import React from 'react';
import QuickAddForm from 'components/forms/QuickAddForm';

export default function QuickAdd() {
  return (
    <>
      <div className="flex flex-col items-center p-6 bg-white rounded-lg border shadow-md md:flex-row dark:border-gray-700 dark:bg-gray-800 w-full">
        <QuickAddForm className="mt-3 w-full" />
      </div>
    </>
  );
}
