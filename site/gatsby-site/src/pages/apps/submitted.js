import React, { useState, useEffect } from 'react';
import AiidHelmet from '../../components/AiidHelmet';
import { ObjectId } from 'bson';
import { Button, Row, Col, Card, Badge, ListGroup } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import { DELETE_QUICKADD, FIND_QUICKADD } from '../../graphql/quickadd.js';
import { useUserContext } from '../../contexts/userContext';
import Layout from '../../components/Layout';
import { StyledHeading, StyledMainWrapper } from '../../components/styles/Docs';
import SubmissionList from '../../components/submissions/SubmissionList';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { Trans, useTranslation } from 'react-i18next';
import ListSkeleton from 'elements/Skeletons/List';

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
    <Layout {...props}>
      <AiidHelmet path={props.location.pathname}>
        <title>{t('Submitted Incident Report List')}</title>
      </AiidHelmet>
      <div className={'titleWrapper'}>
        <StyledHeading>
          <Trans ns="submitted">Submitted Incident Report List</Trans>
        </StyledHeading>
      </div>
      <StyledMainWrapper className="bootstrap">
        <SubmissionList />
        <h2>
          <Trans ns="submitted">Quick Add URLs</Trans>
        </h2>
        <p>
          <Trans ns="submitted" i18nKey="quickaddDescription">
            These reports were added anonymously by users in the Quick Add form on the landing page
          </Trans>
        </p>
        <ListGroup className="mb-5">
          {sortedQuickAdds.length < 1 && <ListSkeleton />}
          {sortedQuickAdds.map(({ _id, url, date_submitted }) => (
            <ListGroup.Item key={_id} className="m-0 p-2">
              <Card.Header>
                <Row>
                  <Col xs={12} sm={2} lg={2} className="flex items-center">
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
                      <Trans>Delete</Trans>&gt;
                    </Button>
                  </Col>
                  <Col xs={12} sm={10} lg={10}>
                    {' '}
                    <a href={url} style={{ overflowWrap: 'break-word' }}>
                      {url}
                    </a>
                    <br />
                    <Badge bg="secondary">Sub: {date_submitted}</Badge>
                  </Col>
                </Row>
              </Card.Header>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </StyledMainWrapper>
    </Layout>
  );
};

export default SubmittedIncidentsPage;
