import React, { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';

export default function WebArchiveLink({ url, date, children }) {
  const [archiveURL, setArchiveURL] = useState(null);

  const timestamp = date.replace('-', '');

  const waUrl = `https://archive.org/wayback/available?url=${url}&timestamp=${timestamp}`;

  useEffect(() => {
    async function load() {
      try {
        const response = await (await fetch(waUrl)).json();

        if (!response.archived_snapshots.closest) {
          setArchiveURL(url);
        }

        setArchiveURL(response.archived_snapshots.closest.url.replace('http:', 'https:'));
      } catch (e) {
        setArchiveURL(url);
      }
    }

    load();
  }, [url]);

  if (!archiveURL) {
    return <Spinner />;
  }

  return (
    <a href={archiveURL} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
