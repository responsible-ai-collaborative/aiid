import React from 'react';
import { Spinner } from 'flowbite-react';
import { Trans } from 'react-i18next';

import RiskSection from 'components/checklists/RiskSection';

const RiskSections = ({
  risks,
  setFieldValue,
  submitForm,
  tags,
  searchTags,
  allPrecedents,
  risksLoading,
  removeRisk,
  changeSort,
  updateRisk,
  userIsOwner,
}) => {
  const riskSectionProps = {
    setFieldValue,
    submitForm,
    tags,
    searchTags,
    allPrecedents,
    removeRisk,
    changeSort,
    updateRisk,
    userIsOwner,
  };

  return (
    <div className="flex flex-col gap-8 mt-8">
      {risksLoading ? (
        <>
          {(risks || [])
            .filter((risk) => !risk.generated)
            .map((risk) => (
              <RiskSection key={risk.id} {...{ ...riskSectionProps, risk }} />
            ))}
          <div className="flex flex-row">
            <Spinner />
            <span className="ml-2">
              <Trans>Searching for risks matching tags…</Trans>
            </span>
          </div>
        </>
      ) : (
        (risks || []).map((risk) => (
          <RiskSection key={risk.id} {...{ ...riskSectionProps, risk }} />
        ))
      )}
    </div>
  );
};

export default RiskSections;
