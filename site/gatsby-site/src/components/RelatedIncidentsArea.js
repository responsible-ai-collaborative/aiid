import React, { useState, useEffect } from 'react';
import { Button, Spinner } from 'flowbite-react';
import { useLocalization } from 'gatsby-theme-i18n';
import { Trans, useTranslation } from 'react-i18next';
import SimilaritySelector from './SimilaritySelector';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useLocalizePath from 'components/i18n/useLocalizePath';

const RelatedIncidentsArea = ({
  columnKey,
  header,
  reports,
  incidents,
  loading,
  setFieldValue,
  editSimilar = true,
  editId = true,
  error,
}) => {
  const { t } = useTranslation();

  const { locale } = useLocalization();

  const localizePath = useLocalizePath();

  const [reportsOpened, setReportsOpened] = useState(false);

  const [maxIncidents, setMaxIncidents] = useState(3);

  const [similarList, setSimilarList] = useState(reports || incidents || []);

  const [notSureList, setNotSureList] = useState([]);

  const visible = reports || incidents || loading;

  const reportsExist = (reports || incidents) && !loading;

  useEffect(() => {
    if (reportsExist) {
      setReportsOpened(true);
    }
  }, [reportsExist]);

  useEffect(() => {
    if (reports || incidents) {
      setSimilarList(reports || incidents);
    } else {
      setSimilarList([]);
    }
  }, [reports, incidents]);

  const addToNotSureList = (id) => {
    if (!notSureList.includes(id)) {
      setNotSureList([...notSureList, id]);
    }
  };

  const removeFromNotSureList = (id) => {
    setNotSureList(notSureList.filter((item) => item !== id));
  };

  if (!visible) {
    return null;
  }
  return (
    <div data-cy={`related-${columnKey}`}>
      <div key={'header'} className="py-2">
        {header}
        {loading && (
          <>
            {' '}
            <Spinner size={'sm'} />
          </>
        )}
      </div>
      <div className={`${reportsOpened ? 'reports open' : 'reports'} flex flex-wrap gap-2`}>
        {similarList &&
          similarList.slice(0, maxIncidents).map((val) => (
            <div
              className="py-2 px-2 bg-blue-100 border-blue-200 rounded-lg border shadow-md dark:bg-gray-800 dark:border-gray-700 flex-1 md:flex-1/3-fixed flex flex-col justify-between"
              key={val.url || val.incident_id}
              data-cy="result"
            >
              <span>
                {val?.incident_id && (
                  <span className="text-lg">
                    <a
                      href={localizePath({ path: `/cite/${val.incident_id}`, language: locale })}
                      className="text-black hover:text-blue-700"
                      target="_blank"
                      rel="noreferrer"
                    >
                      #{val.incident_id}
                    </a>
                  </span>
                )}
                {` `}-{` `}
                <a
                  href={val.url || '/cite/' + val.incident_id}
                  data-cy="title"
                  className="text-black hover:text-blue-700 text-sm"
                  target="_blank"
                  rel="noreferrer"
                >
                  {val.title}
                </a>
              </span>
              <div className="flex justify-between">
                {setFieldValue && editSimilar && (
                  <div>
                    <p className="text-xs my-2">
                      <Trans>Is this incident related?</Trans>
                    </p>
                    <SimilaritySelector
                      incident_id={val.incident_id}
                      addToNotSureList={addToNotSureList}
                      removeFromNotSureList={removeFromNotSureList}
                      notSureList={notSureList}
                    />
                  </div>
                )}
                {val.incident_id && setFieldValue && editId && (
                  <div className="self-end">
                    <Button
                      size={'xs'}
                      data-cy="set-id"
                      onClick={() => setFieldValue && setFieldValue('incident_id', val.incident_id)}
                    >
                      <p className="m-0 whitespace-nowrap">
                        <Trans>Use ID</Trans> #{val.incident_id}
                      </p>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        {!loading && (error || reports?.length == 0 || incidents?.length == 0) && (
          <span>{error ? error : t('No related reports found.')}</span>
        )}
      </div>
      {similarList.length > maxIncidents && (
        <div className="mt-2">
          <Button
            size={'xs'}
            color="light"
            onClick={() => {
              setMaxIncidents(maxIncidents + 3);
            }}
          >
            <Trans>Load more</Trans>

            <FontAwesomeIcon
              icon={faArrowDown}
              className="fas fa-times ml-1"
              style={{ marginRight: '1ch' }}
            />
          </Button>
        </div>
      )}
    </div>
  );
};

export default RelatedIncidentsArea;
