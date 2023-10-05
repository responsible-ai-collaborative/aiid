import React from 'react';
import { Trans } from 'react-i18next';
import { Dropdown } from 'flowbite-react';
import { exportJson } from 'utils/checklists';

const ExportDropdown = ({ checklist }) => {
  return (
    <Dropdown label="Export">
      <Dropdown.Item onClick={() => exportJson(checklist)}>
        <Trans>JSON</Trans>
      </Dropdown.Item>
      <Dropdown.Item onClick={() => alert('Coming soon')}>
        <Trans>HTML</Trans>
      </Dropdown.Item>
      <Dropdown.Item onClick={() => alert('Coming soon')}>
        <Trans>CSV</Trans>
      </Dropdown.Item>
    </Dropdown>
  );
}

export default ExportDropdown;
