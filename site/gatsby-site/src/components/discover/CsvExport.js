import React, { useEffect, useState } from 'react';
import { connectHits, connectStateResults } from 'react-instantsearch-dom';
import CsvDownloadButton from 'react-json-to-csv';
import { format, fromUnixTime } from 'date-fns';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Tooltip } from 'flowbite-react';
import { Trans } from 'react-i18next';
import Link from 'components/ui/Link';

const convertData = (hits) => {
  return hits.map((hit) => ({
    'incident id': hit.incident_id,
    'report number': hit.report_number,
    title: hit.title,
    'date published': format(fromUnixTime(hit.epoch_date_published), 'yyyy-MM-dd'),
    'date submitted': format(fromUnixTime(hit.epoch_date_submitted), 'yyyy-MM-dd'),
    'date modified': format(fromUnixTime(hit.epoch_date_modified), 'yyyy-MM-dd'),
    'date downloaded': format(fromUnixTime(hit.epoch_date_downloaded), 'yyyy-MM-dd'),
    url: hit.url,
    'source domain': hit.source_domain,
    language: hit.language,
    image: hit.image_url,
    authors: hit.authors.join(','),
    submitters: hit.submitters.join(','),
  }));
};

const CsvExport = ({ hits, isSearchStalled }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (hits) {
      setData(convertData(hits));
    }
  }, [hits]);

  return (
    <div>
      {!isSearchStalled && (
        <Tooltip
          content={
            <Trans>
              Export items from the current page to a CSV file.
              <br />
              To download the full data set, please follow this{' '}
              <Link to={'/research/snapshots/'}>link</Link>.
            </Trans>
          }
          trigger="hover"
          placement="top"
        >
          <CsvDownloadButton
            data={data}
            filename="discover_incidents.csv"
            disabled={!data || data.length == 0}
          >
            <Button
              color="gray"
              size="sm"
              disabled={!data || data.length == 0}
              data-cy="export-to-csv"
            >
              <FontAwesomeIcon icon={faFileCsv} className="mr-2" />
              <Trans>Export</Trans>
            </Button>
          </CsvDownloadButton>
        </Tooltip>
      )}
    </div>
  );
};

export default connectHits(connectStateResults(CsvExport));
