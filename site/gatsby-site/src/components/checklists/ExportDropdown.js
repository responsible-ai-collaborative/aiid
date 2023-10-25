import React from 'react';
import { Trans } from 'react-i18next';
import { Dropdown } from 'flowbite-react';
import { exportJson, exportCsv, exportHtml } from 'utils/checklists';

const ExportDropdown = ({ checklist }) => {
  return (
    <Dropdown label="Export">
      <Dropdown.Item onClick={() => exportJson(checklist)}>
        <Trans>JSON</Trans>
      </Dropdown.Item>
      <Dropdown.Item onClick={() => exportHtml(checklist)}>
        <Trans>HTML</Trans>
      </Dropdown.Item>
      <Dropdown.Item onClick={() => exportCsv(checklist)}>
        <Trans>CSV</Trans>
      </Dropdown.Item>
    </Dropdown>
  );
};

export default ExportDropdown;
