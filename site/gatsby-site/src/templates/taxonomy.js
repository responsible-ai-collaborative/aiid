import React from 'react';
import Layout from 'components/Layout';
import styled from 'styled-components';

const Row = styled.div`
  display: flex;
  flex-direction: row;

  p {
    padding-right: 1em;
  }
`;

const Taxonomy = (props) => {
  if (!props || !props.pageContext) {
    return null;
  }

  const { namespace, description, fields } = props.pageContext.taxaonomy;

  const fieldsArray = [];

  for (const f in fields) {
    fieldsArray.push({
      name: f,
      field: fields[f],
    });
  }

  return (
    <Layout {...props}>
      <Row>
        <p>Namespace:</p>
        <p>{namespace}</p>
      </Row>
      <Row>
        <p>Description:</p>
        <p>{description}</p>
      </Row>
      <p>Fields:</p>
      {fieldsArray.map(({ name, field }) => (
        <Row key={name}>
          <>
            <p>{name}:</p>
            <p>{JSON.stringify(field)}</p>
          </>
        </Row>
      ))}
    </Layout>
  );
};

export default Taxonomy;
