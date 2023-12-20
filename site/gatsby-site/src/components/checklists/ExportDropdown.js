import React from 'react';
import { Trans } from 'react-i18next';
import { Dropdown } from 'flowbite-react';
import { exportJson, exportCsv, exportHtml } from 'utils/checklists';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ExportDropdown = ({ checklist }) => {
  const label = (
    <>
      <FontAwesomeIcon icon={faDownload} className="mr-2" />
      <Trans>Export</Trans>
    </>
  );

  return (
    <Dropdown label={label}>
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
