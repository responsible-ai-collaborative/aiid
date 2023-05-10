import React from 'react';
import { Trans } from 'react-i18next';
import { Dropdown } from 'flowbite-react';
import { Link } from 'gatsby';

async function getSnapshotURL(url, date) {
  const timestamp = date ? date.replace('-', '') : '';

  const waUrl = `https://archive.org/wayback/available?url=${url}&timestamp=${timestamp}`;

  const response = await (await fetch(waUrl)).json();

  return response.archived_snapshots.closest.url.replace('http:', 'https:');
}

export default function WebArchiveLink({ url, date, children, className = '' }) {
  const onClick = async () => {
    const win = window.open('', '_blank');

    try {
      const snapshotUrl = await getSnapshotURL(url, date);

      win.location.href = snapshotUrl;
    } catch (e) {
      win.location.href = url;
    }
  };

  const navigateToUrl = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className={`flex items-center ${className}`} data-cy="web-archive-link">
      <Link to={url}>{children}</Link>
      <div data-cy="dropdown-toggle">
        <Dropdown inline={true} label="" className="-ml-3">
          <Dropdown.Item onClick={() => navigateToUrl(url)} data-cy="original">
            <Trans>View the original report at its source</Trans>
          </Dropdown.Item>
          <Dropdown.Item onClick={onClick} onAuxClick={onClick} data-cy="wayback-machine">
            <Trans>View the report at the Internet Archive</Trans>
          </Dropdown.Item>
        </Dropdown>
      </div>
    </div>
  );
}
