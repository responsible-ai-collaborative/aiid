import React, { useEffect, useState } from 'react';
import { connectHits, connectStateResults } from 'react-instantsearch-dom';
import CsvDownloadButton from 'react-json-to-csv';
import { format, fromUnixTime } from 'date-fns';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';

const convertData = (hits) => {
  return hits.map((hit) => ({
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
    text: hit.text,
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
        <CsvDownloadButton
          data={data}
          filename="discover_incidents.csv"
          disabled={!data || data.length == 0}
        >
          <Button
            variant="secondary"
            size="sm"
            disabled={!data || data.length == 0}
            data-cy="export-to-csv"
          >
            <FontAwesomeIcon icon={faFileCsv} width={'14px'} />
          </Button>
        </CsvDownloadButton>
      )}
    </div>
  );
};

export default connectHits(connectStateResults(CsvExport));
