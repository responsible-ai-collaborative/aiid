import React from 'react';
import Layout from 'components/Layout';
import styled from 'styled-components';
import { StyledHeading } from 'components/styles/Docs';
import md5 from 'md5';

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const Description = styled(Row)`
  p {
    font-size: 1.5em;
    line-height: 1.5;
  }
`;

const Card = styled.div`
  border: 1.5px solid #d9deee;
  border-radius: 5px;
  box-shadow: 0 2px 5px 0px #e3e5ec;
  display: flex;
  flex-direction: column;
  padding: 1em 2em 2em 2em;
  margin-bottom: 2em;
  width: 100%;
`;

const FieldNameHeading = styled.h1`
  font-size: 20px;
  font-weight: 800;
  line-height: 1.5;
  margin-bottom: 0.5em;
`;

const Taxonomy = (props) => {
  if (!props || !props.pageContext) {
    return null;
  }

  const { namespace, description, field_list } = props.pageContext.taxaonomy;

  const sortedFieldsArray = field_list.sort((a, b) => b.weight - a.weight);

  console.log(sortedFieldsArray);

  return (
    <Layout {...props}>
      <div className={'titleWrapper'}>
        <StyledHeading>{namespace}</StyledHeading>
      </div>
      <Description>
        <p>{description}</p>
      </Description>
      <h1 className="heading1">Fields</h1>
      {sortedFieldsArray.map(({ long_name, long_description }) => (
        <Row key={md5(long_name)}>
          <Card>
            <FieldNameHeading>{long_name}</FieldNameHeading>
            {long_description}
          </Card>
        </Row>
      ))}
    </Layout>
  );
};

export default Taxonomy;
