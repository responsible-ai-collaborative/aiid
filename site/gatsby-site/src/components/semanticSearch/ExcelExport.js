import React, { useState } from 'react';
import { Button } from 'flowbite-react';
import { Trans } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv, faFileExcel } from '@fortawesome/free-solid-svg-icons';

// Makes a short, filesystem-safe name fragment out of the query text.
const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'results';

// Parses a YYYY-MM-DD incident date as UTC midnight so the day cannot shift with the time zone.
const toDate = (value) => {
  const [year, month, day] = String(value || '')
    .split('-')
    .map(Number);

  return year && month && day ? new Date(Date.UTC(year, month - 1, day)) : null;
};

const header = (value) => ({ value, fontWeight: 'bold' });

/**
 * Describes each workbook column for the current results. Scores and incident IDs are written as
 * numbers and dates as real dates, so the file sorts and filters correctly in Excel. Links point
 * at whichever site the user is browsing.
 */
const buildColumns = (origin) => [
  {
    header: header('Score'),
    width: 8,
    cell: (row) => ({ value: row.score, type: Number, format: '0.000' }),
  },
  {
    header: header('Incident ID'),
    width: 12,
    cell: (row) => ({ value: row.incident.incident_id, type: Number }),
  },
  {
    header: header('Date'),
    width: 12,
    cell: (row) => {
      const date = toDate(row.incident.date);

      return date
        ? { value: date, type: Date, format: 'yyyy-mm-dd' }
        : { value: row.incident.date || '' };
    },
  },
  {
    header: header('Title'),
    width: 60,
    cell: (row) => ({ value: row.incident.title || '', wrap: true }),
  },
  {
    header: header('Description'),
    width: 100,
    cell: (row) => ({ value: row.incident.description || '', wrap: true }),
  },
  {
    header: header('URL'),
    width: 45,
    cell: (row) => ({ value: `${origin}/cite/${row.incident.incident_id}` }),
  },
];

const csvCell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

const buildCsv = (results, origin) => {
  const rows = [
    ['Score', 'Incident ID', 'Date', 'Title', 'Description', 'URL'],
    ...results.map((row) => [
      row.score,
      row.incident.incident_id,
      row.incident.date || '',
      row.incident.title || '',
      row.incident.description || '',
      `${origin}/cite/${row.incident.incident_id}`,
    ]),
  ];

  return `\uFEFF${rows.map((row) => row.map(csvCell).join(',')).join('\r\n')}`;
};

/** Exports every returned result as CSV or Excel without depending on table pagination. */
export default function ExcelExport({ results, query }) {
  const [exporting, setExporting] = useState(null);

  const [exportError, setExportError] = useState(false);

  const filename = (extension) => {
    const today = new Date().toISOString().slice(0, 10);

    return `semantic-search-${slugify(query)}-${today}.${extension}`;
  };

  const exportExcel = async () => {
    setExporting('excel');
    setExportError(false);

    try {
      const { default: writeExcelFile } = await import('write-excel-file/browser');

      await writeExcelFile(results, {
        sheet: 'Results',
        columns: buildColumns(window.location.origin),
      }).toFile(filename('xlsx'));
    } catch {
      setExportError(true);
    } finally {
      setExporting(null);
    }
  };

  const exportCsv = () => {
    setExporting('csv');
    setExportError(false);

    try {
      const blob = new Blob([buildCsv(results, window.location.origin)], {
        type: 'text/csv;charset=utf-8',
      });

      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');

      link.href = url;
      link.download = filename('csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      setExportError(true);
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        <Button
          color="gray"
          size="sm"
          onClick={exportCsv}
          disabled={Boolean(exporting) || results.length === 0}
          data-cy="semantic-search-export-csv"
        >
          <FontAwesomeIcon icon={faFileCsv} className="mr-2" />
          <Trans>Export to CSV</Trans>
        </Button>
        <Button
          color="gray"
          size="sm"
          onClick={exportExcel}
          disabled={Boolean(exporting) || results.length === 0}
          data-cy="semantic-search-export"
        >
          <FontAwesomeIcon icon={faFileExcel} className="mr-2" />
          <Trans>Export to Excel</Trans>
        </Button>
      </div>
      {exportError && (
        <span className="text-sm text-red-700" role="alert" data-cy="semantic-search-export-error">
          <Trans>Could not export these results. Please try again.</Trans>
        </span>
      )}
    </div>
  );
}
