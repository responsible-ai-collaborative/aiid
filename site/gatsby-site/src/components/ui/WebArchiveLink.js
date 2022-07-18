import React from 'react';
import { Dropdown, SplitButton } from 'react-bootstrap';
import styled from 'styled-components';

const ArchiveOriginalSplit = styled(SplitButton)`
  > *.dropdown-toggle {
    padding: 0px !important;
    margin: 0px !important;
    margin-left: 2px !important;
    width: 2ch;
    color: inherit;
  }
  > *:not(.dropdown-toggle) {
    padding: 0px !important;
    margin: 0px !important;
  }
  a {
    text-decoration: none;
    font-weight: inherit;
  }
`;

async function getSnapshotURL(url, date) {
  const timestamp = date ? date.replace('-', '') : '';

  const waUrl = `https://archive.org/wayback/available?url=${url}&timestamp=${timestamp}`;

  const response = await (await fetch(waUrl)).json();

  return response.archived_snapshots.closest.url.replace('http:', 'https:');
}

export default function WebArchiveLink({ url, date, children, className }) {
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
    <ArchiveOriginalSplit
      variant="link"
      title={children}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      <Dropdown.Item eventKey="1" href={url} target="_blank" rel="noopener noreferrer">
        View the page at its original source
      </Dropdown.Item>
      <Dropdown.Item eventKey="2" onClick={onClick} target="_blank" rel="noopener noreferrer">
        View the page archived by the Wayback Machine
      </Dropdown.Item>
    </ArchiveOriginalSplit>
  );
}
