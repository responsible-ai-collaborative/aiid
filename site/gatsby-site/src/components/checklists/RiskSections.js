import React from 'react';
import { Spinner } from 'flowbite-react';
import { Trans } from 'react-i18next';

import RiskSection from 'components/checklists/RiskSection';
import { shouldBeGrouped } from 'utils/checklists';

const RiskSections = ({
  risks,
  generatedRisks,
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

  console.log(`risks`, risks);

  const unannotatedRisks = (generatedRisks || []).filter(
    generatedRisk => risks.every(
      (manualRisk) => !areDuplicates(generatedRisk, manualRisk)
    )
  );

  return (
    <div className="flex flex-col gap-8 mt-8">

      <h2>Manual</h2>
      {(risks || []).map((risk) => (
        <RiskSection key={risk.id} {...{ ...riskSectionProps, risk }} />
      ))}
      
      <h2>Generated</h2>
      {unannotatedRisks.map(risk => (
          <RiskSection key={risk.id} {...{ ...riskSectionProps, risk }} />
      ))}

      {/*
        {risksLoading ? (
          <div className="flex flex-row">
            <Spinner />
            <span className="ml-2">
              <Trans>Searching for risks matching tags…</Trans>
            </span>
          </div>
        ) : (
          (generatedRisks || []).filter().map(risk => (
            <RiskSection key={risk.id} {...{ ...riskSectionProps, risk }} />
          ))
        )}
      </>
      */}
    </div>
  );
};

function areDuplicates(A, B) {
  return (
    A.tags.length == B.tags.length &&
    A.tags.every((aTag) => B.tags.some((bTag) => shouldBeGrouped(bTag, aTag))) &&
    B.tags.every((bTag) => A.tags.some((aTag) => shouldBeGrouped(aTag, bTag)))
  );
}

export default RiskSections;
