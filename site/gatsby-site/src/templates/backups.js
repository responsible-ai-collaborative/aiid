import React from 'react';
import HeadContent from 'components/HeadContent';
import Link from 'components/ui/Link';
import { LocalizedLink } from 'plugins/gatsby-theme-i18n';
import { format } from 'date-fns';
import config from '../../config';
import { useTranslation } from 'react-i18next';

const Backups = ({ pageContext }) => {
  const { backups, excelExports } = pageContext;

  if (!backups) {
    return null;
  }

  /**
   * Parses the creation date from the backup key.
   *
   * The expected format of the key is "backup-YYYYMMDDHHmmss.tar.bz2" (e.g. "backup-20240101101425.tar.bz2").
   * The function extracts the date and time from the key and returns a JavaScript Date object.
   *
   * @param {string} key - The backup key.
   * @returns {Date} The creation date of the backup.
   */
  const parseCreationDate = (key) => {
    const stringDate = key.split('backup-')[1].split('.')[0];

    const year = stringDate.substring(0, 4);

    const month = stringDate.substring(4, 6);

    const day = stringDate.substring(6, 8);

    const hour = stringDate.substring(8, 10);

    const minute = stringDate.substring(10, 12);

    return new Date(year, month - 1, day, hour, minute);
  };

  const parseExcelExportDate = (key) => {
    const stringDate = key.replace('AIID_Excel_Export-', '').replace('.xlsx', '');

    const year = stringDate.substring(0, 4);

    const month = stringDate.substring(4, 6);

    const day = stringDate.substring(6, 8);

    return new Date(year, month - 1, day);
  };

  return (
    <>
      <div className="titleWrapper">
        <h1>Database Snapshots</h1>
      </div>
      <div className="styled-main-wrapper">
        <h2>Citing the Database as a Whole</h2>
        <p>We invite you to cite:</p>
        <blockquote>
          McGregor, S. (2021) Preventing Repeated Real World AI Failures by Cataloging Incidents:
          The AI Incident Database. In Proceedings of the Thirty-Third Annual Conference on
          Innovative Applications of Artificial Intelligence (IAAI-21). Virtual Conference.
        </blockquote>
        <p>
          The <a href="https://arxiv.org/abs/2011.08512">pre-print</a> is available on arXiv
        </p>
        <h2>Citing a Specific Incident</h2>
        <p>
          Every incident has its own suggested citation that credits both the submitter(s) of the
          incident and the editor(s) of the incident. The submitters are the people that submitted
          reports associated with the incident and their names are listed in the order in which
          their submissions were added to the AIID. Since reports can be added to an incident record
          through time, our suggested citation format includes the access date. You can find
          incident citations at <code>https://incidentdatabase.ai/cite/INSERT_NUMBER_HERE</code>.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 mt-6">
          <h2 className="mb-0 order-1 md:order-1">Snapshot Downloads</h2>
          <p className="paragraph order-2 md:order-3">
            Weekly point-in-time dumps of the full database, available in JSON, MongoDB archive, and
            CSV formats. Please <LocalizedLink to="/contact">contact us</LocalizedLink> to let us
            know what you are using the database for so we can list your work and ensure your use
            case is not dropped from support. Best for developers and researchers building on the
            raw database.
          </p>
          <ul className="pl-8 leading-6 order-3 md:order-5" data-cy="snapshots-list">
            {backups
              .map((b) => ({
                ...b,
                Url: `${config.cloudflareR2.publicBucketUrl}/${b.Key}`,
                CreationDate: parseCreationDate(b.Key),
              }))
              .map((value) => (
                <li key={`snapshot-${value['Key']}`}>
                  {format(new Date(value['CreationDate']), 'yyyy-MM-dd hh:mm a')} &middot;{' '}
                  {(value['Size'] / 1000000).toFixed(2)} MB &middot;{' '}
                  <Link to={value['Url']}>{value['Key']}</Link>
                </li>
              ))}
          </ul>

          <h2 className="mb-0 order-4 md:order-2">Excel Export</h2>
          <p className="order-5 md:order-4">
            An Excel file, updated weekly, that combines all numbered incidents with many of their
            taxonomy classifications. Suitable for analysis and research; updated every Monday. No
            coding required — download and open directly in Excel or Google Sheets. Not all
            relationships can be modeled in spreadsheet form. If the spreadsheet does not provide
            the data you require, we recommend working with the MongoDB snapshots.
          </p>
          <div className="order-6 md:order-6">
            {excelExports && excelExports.length > 0 ? (
              <ul className="pl-8 leading-6" data-cy="excel-exports-list">
                {excelExports.map((item) => (
                  <li key={`excel-export-${item.Key}`}>
                    {format(parseExcelExportDate(item.Key), 'yyyy-MM-dd')} &middot;{' '}
                    {(item.Size / 1000000).toFixed(2)} MB &middot;{' '}
                    <Link to={`${config.cloudflareR2.publicBucketUrl}/${item.Key}`}>
                      {item.Key}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No Excel exports available yet.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export const Head = (props) => {
  const {
    location: { pathname },
  } = props;

  const { t } = useTranslation();

  const metaTitle = t('Database Backups and Snapshots');

  const metaDescription = t('Find and download the latest Database Backups and snapshots');

  return <HeadContent path={pathname} metaTitle={metaTitle} metaDescription={metaDescription} />;
};

export default Backups;
