import { ListGroup } from 'flowbite-react';
import React from 'react';

const Wordlist = ({ content }) => {
  return (
    <ListGroup>
      {content.map((value, index) => (
        <div
          className={`p-3 ${index < content.length - 1 ? 'border-b' : ''}`}
          key={`word-${value[0]}`}
        >
          <div className="flex flex-row w-full justify-between">
            <p className="truncate text-sm font-medium text-gray-900 dark:text-white my-0">
              {value[0]}
            </p>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
              {value[1]}
            </span>
          </div>
        </div>
      ))}
    </ListGroup>
  );
};

export default Wordlist;
