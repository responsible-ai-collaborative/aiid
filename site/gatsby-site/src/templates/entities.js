import EntitiesTable from 'components/entities/EntitiesTable';
import LayoutHideSidebar from 'components/LayoutHideSidebar';
import Container from 'elements/Container';
import React from 'react';

const EntitiesPage = ({ pageContext, ...props }) => {
  const { entities } = pageContext;

  return (
    <LayoutHideSidebar {...props}>
      <Container className="tw-container-xl mt-6">
        <h1 className="text-5xl mt-6 font-extrabold dark:text-white">Entities</h1>
        <EntitiesTable data={entities} className="mt-6" />
      </Container>
    </LayoutHideSidebar>
  );
};

export default EntitiesPage;
