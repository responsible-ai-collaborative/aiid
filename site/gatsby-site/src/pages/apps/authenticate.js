import React, { useState, Component, useEffect } from 'react';
import Helmet from 'react-helmet';
import Layout from 'components/Layout';
import { Form, Button } from 'react-bootstrap';

import { StyledHeading, StyledMainWrapper } from 'components/styles/Docs';
import { useUserContext } from 'contexts/userContext';

function AuthenticateUI() {
  const {
    mongoUserKey,
    actions: { setUserAPIKey, logout },
  } = useUserContext();

  const [apiKey, setAPIKey] = useState(mongoUserKey);

  const update = () => {
    setUserAPIKey(apiKey);
    window.location.reload(false);
  };

  const remove = () => {
    logout();
    window.location.reload(false);
  };

  const input = (e) => {
    setAPIKey(e.target.value);
  };

  useEffect(() => {
    setAPIKey(mongoUserKey);
  }, [mongoUserKey]);

  return (
    <Form>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>API Token</Form.Label>
        <Form.Control
          type="text"
          placeholder="hf7h2lsH...834djsk"
          value={apiKey || ''}
          onChange={input}
        />
        <Form.Text className="text-muted">Do not share this token with anyone.</Form.Text>
      </Form.Group>
      <Button variant="primary" onClick={update}>
        Save Token
      </Button>{' '}
      <Button variant="danger" onClick={remove}>
        Delete Token
      </Button>
    </Form>
  );
}

export default class Authenticate extends Component {
  render() {
    return (
      <Layout {...this.props}>
        <Helmet>
          <title>Authenticate Into Database</title>
        </Helmet>
        <div className={'titleWrapper'}>
          <StyledHeading>Authenticate Into Database</StyledHeading>
        </div>
        <StyledMainWrapper>
          <p>
            Editors of the AIID are provisioned API tokens allowing them to promote incidents from
            the review queue to the full database. The token is manually granted by a current AIID
            administrator for you to enter into this form.
          </p>
          <AuthenticateUI />
        </StyledMainWrapper>
      </Layout>
    );
  }
}
