import React from 'react';
import HeadContent from 'components/HeadContent';
import Link from 'components/ui/Link';
import { getCanonicalUrl } from 'utils/getCanonicalUrl';
import Container from 'elements/Container';

const EntityCite = ({ pageContext }) => {
  const { duplicate_entity_id, true_entity_id } = pageContext;

  return (
    <>
      <div className="titleWrapper">
        <h1>{duplicate_entity_id}</h1>
      </div>
      <div className="styled-main-wrapper">
        <Container>
          This entity was a duplicate of{' '}
          <Link to={`/entities/${true_entity_id}`}>{true_entity_id}</Link>.
        </Container>
      </div>
    </>
  );
};

export const Head = (props) => {
  const {
    location: { pathname },
  } = props;

  const { duplicate_entity_id, true_entity_id } = props.pageContext;

  const metaTitle = 'Entity ' + true_entity_id;

  const metaDescription = 'Entity ' + duplicate_entity_id;

  const canonicalUrl = getCanonicalUrl(true_entity_id);

  return <HeadContent path={pathname} {...{ metaTitle, metaDescription, canonicalUrl }} />;
};

export default EntityCite;
