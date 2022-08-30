import React from 'react';
import EntityCard from './EntityCard';

export default function EntitiesCard({ entities, className = '' }) {
  return (
    <div
      className={`tw-p-6 tw-bg-white tw-rounded-lg tw-border tw-border-gray-200 tw-shadow-md tw-dark:bg-gray-800 tw-dark:border-gray-700 ${className}`}
    >
      <div className="tw-grid md:tw-grid-cols-2 tw-gap-4">
        {entities.map((entity) => (
          <div key={entity.id}>
            <EntityCard entity={entity} />
          </div>
        ))}
      </div>
    </div>
  );
}
