import { Table } from 'flowbite-react';
import React from 'react';

const Wordlist = ({ content }) => {
  console.log('content', content);
  return (
    <Table className="" hoverable={true}>
      <Table.Body className="divide-y">
        {content.map((value) => (
          <Table.Row className="bg-white dark:bg-gray-800" key={`word-${value[0]}`}>
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white col-span-3 w-3/4">
              <p className="truncate text-sm font-medium text-gray-900 dark:text-white mb-0">
                {value[0]}
              </p>
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white col-span-1 w-1/4">
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
                {value[1].toString()}
              </span>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default Wordlist;
