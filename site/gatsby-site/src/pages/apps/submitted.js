import React, { useState, useEffect } from 'react';
import AiidHelmet from '../../components/AiidHelmet';
import { ObjectId } from 'bson';
import { useMutation, useQuery } from '@apollo/client';
import { DELETE_QUICKADD, FIND_QUICKADD } from '../../graphql/quickadd.js';
import { useUserContext } from '../../contexts/userContext';
import SubmissionList from '../../components/submissions/SubmissionList';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { Trans, useTranslation } from 'react-i18next';
import ListSkeleton from 'elements/Skeletons/List';
import { Badge, Button, ListGroup } from 'flowbite-react';

const SubmittedIncidentsPage = ({ ...props }) => {
  const { isRole } = useUserContext();

  const isAdmin = isRole('admin');

  const addToast = useToastContext();

  const [quickAdds, setQuickAdds] = useState([]);

  const [deleteQuickAdd] = useMutation(DELETE_QUICKADD);

  const { loading, error, data } = useQuery(FIND_QUICKADD, { variables: { query: {} } });

  const { t, i18n } = useTranslation(['submitted']);

  // Respond to a successful fetch of the quickadd data
  useEffect(() => {
    if (!loading && !error && data) {
      setQuickAdds(data['quickadds']);
    } else if (!loading && error) {
      addToast({
        message: (
          <Trans i18n={i18n} ns="submitted">
            Error deleting quick added incident: {error.message}
          </Trans>
        ),
        severity: SEVERITY.danger,
        error,
      });
    }
  }, [loading, data, error]);

  const submitDeleteQuickAdd = async (id) => {
    const bsonID = new ObjectId(id);

    try {
      await deleteQuickAdd({
        variables: {
          query: {
            _id: bsonID,
          },
        },
      });

      const result = quickAdds.filter(function (x) {
        return x['_id'] !== id;
      });

      setQuickAdds(result);
      addToast({
        message: <>Removed quick-added URL from database</>,
        severity: SEVERITY.info,
      });
    } catch (e) {
      addToast({
        message: <>Error deleting quick added incident: {e.message}</>,
        severity: SEVERITY.danger,
        error: e,
      });
    }
  };

  // sort by value
  const sortedQuickAdds = [...quickAdds].sort(function (a, b) {
    return a['date_submitted'] - b['date_submitted'];
  });

  return (
    <>
      <AiidHelmet path={props.location.pathname}>
        <title>{t('Submitted Incident Report List')}</title>
      </AiidHelmet>
      <div className={'titleWrapper'}>
        <h1>
          <Trans ns="submitted">Submitted Incident Report List</Trans>
        </h1>
      </div>
      <div>
        <SubmissionList />
        <div className="mt-5">
          <h2>
            <Trans ns="submitted">Quick Add URLs</Trans>
          </h2>
          <p>
            <Trans ns="submitted" i18nKey="quickaddDescription">
              These reports were added anonymously by users in the Quick Add form on the landing
              page
            </Trans>
          </p>
          <ListGroup className="mb-5">
            {sortedQuickAdds.length < 1 && <ListSkeleton />}
            {sortedQuickAdds.map(({ _id, url, date_submitted }) => (
              <div
                key={_id}
                className="flex flex-row md:flex-wrap flex-nowrap border-b last:border-none m-0 p-2"
              >
                <div className="flex">
                  <div className="flex items-center mr-10">
                    <Button
                      variant="outline-secondary"
                      disabled={!isAdmin}
                      onClick={() => {
                        if (
                          window.confirm(t('Are you sure you want to delete “{{url}}”?', { url }))
                        ) {
                          submitDeleteQuickAdd(_id);
                        }
                      }}
                    >
                      <Trans>Delete</Trans>
                      <svg
                        aria-hidden="true"
                        className="ml-2 -mr-1 w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </Button>
                  </div>
                  <div>
                    {' '}
                    <a href={url} className="break-all" style={{ overflowWrap: 'break-word' }}>
                      {url}
                    </a>
                    <br />
                    <div className="flex">
                      <Badge>Sub: {date_submitted}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </ListGroup>
        </div>
      </div>
    </>
  );
};

export default SubmittedIncidentsPage;
