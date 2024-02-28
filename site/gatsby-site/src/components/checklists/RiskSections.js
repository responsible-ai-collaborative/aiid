import React, { useState } from 'react';
import { Spinner, Button } from 'flowbite-react';
import { Trans } from 'react-i18next';
import { faWindowMaximize, faWindowMinimize, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import RiskSection from 'components/checklists/RiskSection';
import { shouldBeGrouped, generateId, tagsIdentifier } from 'utils/checklists';

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
  addRisk,
}) => {

  const [openSections, setOpenSections] = useState([]);

  console.log(`risks`, risks);
  console.log(`allPrecedents`, allPrecedents);

  const unannotatedRisks = (generatedRisks || []).filter(
    generatedRisk => risks.every(
      (manualRisk) => !areDuplicates(generatedRisk, manualRisk)
    )
  );

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

  const manualRiskIdentifiers = (
    risks.map(risk => tagsIdentifier(risk))
  );

  return (
    <section>
      <header className="flex mt-6">
        <h2>Risks</h2>
        <div className="flex gap-2 ml-auto">
          <Button
            color="light"
            onClick={() => {
              /*
              const riskIds = risks.map(risk => risk.id);
              const generatedRiskIds =  generatedRisks.map(risk => risk.id);
              */
              setOpenSections(
                [...risks, ...generatedRisks].map(
                  (risk) => tagsIdentifier(risk)
                )
              );
            }}
          >
            <FontAwesomeIcon icon={faWindowMaximize} className="mr-2" />
            <Trans>Expand all</Trans>
          </Button>
          <Button
            color="light"
            onClick={() => { setOpenSections([]) }}
          >
            <FontAwesomeIcon icon={faWindowMinimize} className="mr-2" />
            <Trans>Collapse all</Trans>
          </Button>
          {userIsOwner && (
            <Button
              onClick={() => {
                addRisk(
                  {
                    id: generateId(),
                    title: 'Untitled Risk',
                    tags: [],
                    precedents: [],
                    risk_status: 'Not Mitigated',
                    risk_notes: '',
                    severity: '',
                    likelihood: '',
                  }
                );
              }}
            >
              <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
              <Trans>Add Risk</Trans>
            </Button>
          )}
        </div>
      </header>
      {openSections.join(", ")}
      <div className="flex flex-col gap-8 mt-8">

        {(risks || []).map((risk) => (
          <RiskSection
            key={risk.id}
            open={openSections.includes(tagsIdentifier(risk)) ? true : undefined}
            generated={false}
            {...{ ...riskSectionProps, risk, setOpenSections }} />
        ))}
        
        {unannotatedRisks
          .filter(risk => !manualRiskIdentifiers.includes(tagsIdentifier(risk)))
          .map(risk => (
            <RiskSection
              key={tagsIdentifier(risk)}
              generated={true}
              open={openSections.includes(tagsIdentifier(risk)) ? true : undefined}
              {...{ ...riskSectionProps, risk, setOpenSections }}
            />
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

        <pre>{JSON.stringify(allPrecedents, null, 2)}</pre>
      </div>
    </section>
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
