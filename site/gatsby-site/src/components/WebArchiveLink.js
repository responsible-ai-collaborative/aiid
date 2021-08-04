import React from 'react';

async function getSnapshotURL(url, date) {
  const timestamp = date ? date.replace('-', '') : '';

  const waUrl = `https://archive.org/wayback/available?url=${url}&timestamp=${timestamp}`;

  const response = await (await fetch(waUrl)).json();

  return response.archived_snapshots.closest.url.replace('http:', 'https:');
}

export default function WebArchiveLink({ url, date, children }) {
  const onClick = async (e) => {
    e.preventDefault();
    const win = window.open('', '_blank');

    try {
      const snapshotUrl = await getSnapshotURL(url, date);

      win.location.href = snapshotUrl;
    } catch (e) {
      win.location.href = url;
    }
  };

  return (
    <a onClick={onClick} href={url} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
