import React, { useState, useEffect } from 'react';
import Helmet from 'react-helmet';
import { ObjectId } from 'bson';
import { Button, Spinner, Row, Col, Card, Badge, ListGroup } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import { DELETE_QUICKADD, FIND_QUICKADD } from '../../graphql/quickadd.js';
import { useUserContext } from 'contexts/userContext';
import Layout from 'components/Layout';
import { StyledHeading, StyledMainWrapper } from 'components/styles/Docs';
import SubmissionList from 'components/submissions/SubmissionList';
import useToastContext, { SEVERITY } from 'hooks/useToast';

const SubmittedIncidentsPage = ({ ...props }) => {
  const { isRole } = useUserContext();

  const isAdmin = isRole('admin');

  const addToast = useToastContext();

  const [quickAdds, setQuickAdds] = useState([]);

  const [deleteQuickAdd] = useMutation(DELETE_QUICKADD);

  const { loading, error, data } = useQuery(FIND_QUICKADD, { variables: { query: {} } });

  // Respond to a successful fetch of the quickadd data
  useEffect(() => {
    if (!loading && !error && data) {
      setQuickAdds(data['quickadds']);
    } else if (!loading && error) {
      console.log(error);
      addToast({
        message: <>Error deleting quick added incident: {error.message}</>,
        severity: SEVERITY.danger,
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
      });
    }
  };

  // sort by value
  const sortedQuickAdds = [...quickAdds].sort(function (a, b) {
    return a['date_submitted'] - b['date_submitted'];
  });

  return (
    <Layout {...props}>
      <Helmet>
        <title>Submitted Incident Report List</title>
      </Helmet>
      <div className={'titleWrapper'}>
        <StyledHeading>Submitted Incident Report List</StyledHeading>
      </div>
      <SubmissionList />
      <StyledMainWrapper>
        <h1>Quick Add URLs</h1>
        <p>
          These reports were added anonymously by users in the Quick Add form on the landing page
        </p>
        <ListGroup className="mb-5">
          {sortedQuickAdds.length < 1 && (
            <>
              <Spinner as="span" animation="border" size="lg" role="status" aria-hidden="true" />{' '}
              <p>Loading Quick Adds...</p>
            </>
          )}
          {sortedQuickAdds.map(({ _id, url, date_submitted }) => (
            <ListGroup.Item key={_id} className="m-0 p-0">
              <Card.Header>
                <Row>
                  <Col xs={12} sm={2} lg={2}>
                    <Button
                      variant="outline-secondary"
                      disabled={!isAdmin}
                      onClick={() => submitDeleteQuickAdd(_id)}
                    >
                      Delete &gt;
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
