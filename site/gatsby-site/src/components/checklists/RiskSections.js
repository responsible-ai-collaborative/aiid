import React, { useState } from 'react';
import { Spinner, Button } from 'flowbite-react';
import { Trans } from 'react-i18next';
import {
  faWindowMaximize,
  faWindowMinimize,
  faPlusCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import RiskSection from 'components/checklists/RiskSection';
import { generateId, tagsIdentifier } from 'utils/checklists';

const RiskSections = ({
  risks,
  generatedRisks,
  generatedRisksLoading,
  setFieldValue,
  submitForm,
  tags,
  searchTags,
  allPrecedents,
  removeRisk,
  changeSort,
  updateRisk,
  userIsOwner,
  addRisk,
}) => {
  // Contains strings yielded by tagIdentifiers,
  // used to persist open or closed state of sections
  // across manual and generated risks.
  const [openSections, setOpenSections] = useState([]);

  // We want to filter out the generated risks
  // that match manually-annotated risks by tags.
  const manualRiskIdentifiers = risks.map((risk) => tagsIdentifier(risk));

  const bareUpdateRisk = updateRisk;

  // If we alter the risk query tags,
  // the id in openSections won't match anymore,
  // so we have to wrap the update funcion
  // to update the list of open sections if necessary.
  updateRisk = (risk, attributeValueMap, risks) => {
    if (attributeValueMap.tags) {
      setOpenSections((openSections) => {
        const result = [...openSections];

        result.splice(result.indexOf(tagsIdentifier(risk)), 1);
        result.push([...(attributeValueMap?.tags || [])].sort().join('___'));
        return result;
      });
    }
    bareUpdateRisk(risk, attributeValueMap, risks);
  };

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
    allRisks: risks,
  };

  return (
    <section>
      <header className="flex flex-wrap mt-6">
        <h2>
          <Trans>Risks</Trans>
        </h2>
        <div className="flex flex-wrap gap-2 ml-auto">
          <Button
            color="light"
            onClick={() => {
              setOpenSections([...risks, ...generatedRisks].map((risk) => tagsIdentifier(risk)));
            }}
          >
            <FontAwesomeIcon icon={faWindowMaximize} className="mr-2" />
            <Trans>Expand all</Trans>
          </Button>
          <Button
            color="light"
            onClick={() => {
              setOpenSections([]);
            }}
          >
            <FontAwesomeIcon icon={faWindowMinimize} className="mr-2" />
            <Trans>Collapse all</Trans>
          </Button>
          {userIsOwner && (
            <Button
              onClick={() => {
                addRisk({
                  id: generateId(),
                  title: 'Untitled Risk',
                  tags: [],
                  precedents: [],
                  risk_status: 'Not Mitigated',
                  risk_notes: '',
                  severity: '',
                  likelihood: '',
                });
              }}
            >
              <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
              <Trans>Add Risk</Trans>
            </Button>
          )}
        </div>
      </header>
      <div className="flex flex-col gap-8 mt-8">
        {(risks || []).map((risk) => (
          <RiskSection
            key={risk.id}
            open={openSections.includes(tagsIdentifier(risk)) ? true : undefined}
            generated={false}
            {...{ ...riskSectionProps, risk, setOpenSections }}
          />
        ))}

        {generatedRisks
          // If `tagsIdentifier(risk)` is in `manualRiskIdentifiers`,
          // then the tags of `risks` exactly match
          // those of some manually-annotated risk.
          // We don't want to show a generated risk with the same tags.
          .filter((risk) => !manualRiskIdentifiers.includes(tagsIdentifier(risk)))
          .map((risk) => (
            <RiskSection
              key={tagsIdentifier(risk)}
              generated={true}
              open={openSections.includes(tagsIdentifier(risk)) ? true : undefined}
              {...{ ...riskSectionProps, risk, setOpenSections }}
            />
          ))}

        {generatedRisksLoading && <Spinner />}
      </div>
    </section>
  );
};

export default RiskSections;
