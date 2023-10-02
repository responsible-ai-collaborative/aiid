import React, { useEffect, useState, useRef } from 'react';
import { Form } from 'formik';
import { Button, Textarea, Spinner } from 'flowbite-react';
import { Trans, useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { LocalizedLink } from 'plugins/gatsby-theme-i18n';
import debounce from 'lodash/debounce';

import { DELETE_CHECKLIST } from '../../graphql/checklists';
import {
  Label,
  DeleteButton,
  abbreviatedTag,
  emptyRisk,
  shouldBeGrouped,
  risksEqual,
} from 'utils/checklists';
import Tags from 'components/forms/Tags';
import EditableLabel from 'components/checklists/EditableLabel';
import ExportDropdown from 'components/checklists/ExportDropdown';
import RiskSections from 'components/checklists/RiskSections';
import useToastContext, { SEVERITY } from '../../hooks/useToast';

export default function CheckListForm({
  values,
  handleSubmit,
  setFieldValue,
  submitForm,
  tags,
  isSubmitting,
  submissionError,
}) {
  const [deleteChecklist] = useMutation(DELETE_CHECKLIST);

  const { t } = useTranslation();

  const addToast = useToastContext();

  const confirmDeleteChecklist = async (id) => {
    if (window.confirm('Delete this checklist?')) {
      try {
        await deleteChecklist({ variables: { query: { id } } });
        window.location = '/apps/checklists/';
      } catch (error) {
        addToast({
          message: t('Could not delete checklist.'),
          severity: SEVERITY.danger,
          error,
        });
      }
    }
  };

  const [risksLoading, setRisksLoading] = useState(false);

  const [allPrecedents, setAllPrecedents] = useState([]);

  const searchTags = [...values['tags_goals'], ...values['tags_methods'], ...values['tags_other']];

  useEffect(() => {
    searchRisks({ values, setFieldValue, setRisksLoading, setAllPrecedents, t, addToast });
  }, [values['tags_goals'], values['tags_methods'], values['tags_other']]);

  useEffect(() => {
    submitForm();
  }, [values]);

  const debouncedSetFieldValue = useRef(debounce(setFieldValue, 1000)).current;

  const removeRisk = (findFunction) => {
    setFieldValue(
      'risks',
      values.risks.filter((risk) => !findFunction(risk))
    );
  };

  const changeSort = (sortFunction) => (event) => {
    event.preventDefault();
    setFieldValue('risks', values.risks.sort(sortFunction));
  };

  const updateRisk = (risk, attributeValueMap) => {
    const updatedRisks = [...values.risks];

    const updatedRisk = updatedRisks.find((r) => risksEqual(r, risk));

    for (const attribute in attributeValueMap) {
      if (attribute != 'precedents') {
        updatedRisk.generated = false;
      }
      updatedRisk[attribute] = attributeValueMap[attribute];
    }

    setFieldValue('risks', updatedRisks);
    submitForm();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Header>
        <LocalizedLink to="/apps/checklists" className="text-lg">
          <Trans>Risk Checklists</Trans>
        </LocalizedLink>
        <HeaderRow>
          <h1>
            <EditableLabel
              title={values.name}
              onChange={(event) => debouncedSetFieldValue('name', event.target.value)}
              textClasses="text-2xl"
              iconClasses="text-lg vertical-align"
            />
          </h1>
          <HeaderControls>
            <SavingIndicator {...{ isSubmitting, submissionError }} />
            <Button color="light" onClick={() => alert('Coming soon')}>
              <Trans>Subscribe</Trans>
            </Button>
            <DeleteButton type="button" onClick={() => confirmDeleteChecklist(values.id)}>
              <Trans>Delete</Trans>
            </DeleteButton>
            <ExportDropdown checklist={values} />
          </HeaderControls>
        </HeaderRow>
      </Header>
      <Info>This feature is in development. Data entered will not be retained.</Info>
      <AboutSystem formAbout={values.about} {...{ debouncedSetFieldValue }} />
      <section>
        <SideBySide className="my-4">
          <GoalsTagInput {...{ values, tags, setFieldValue }} />
          <MethodsTagInput {...{ values, tags, setFieldValue }} />
        </SideBySide>
        <OtherTagInput {...{ values, tags, setFieldValue }} />
      </section>
      <section>
        <header className="flex mt-6">
          <h2>Risks</h2>
          <div className="flex gap-2 ml-auto">
            <Button
              color="light"
              onClick={() =>
                setFieldValue(
                  'risks',
                  values.risks.map((r) => ({ ...r, startClosed: false }))
                )
              }
            >
              <Trans>Expand all</Trans>
            </Button>
            <Button
              color="light"
              onClick={() =>
                setFieldValue(
                  'risks',
                  values.risks.map((r) => ({ ...r, startClosed: true }))
                )
              }
            >
              <Trans>Collapse all</Trans>
            </Button>
            <Button
              onClick={() => {
                setFieldValue(
                  'risks',
                  [emptyRisk({ generated: false })].concat(values.risks || [])
                );
              }}
            >
              <Trans>Add Risk</Trans>
            </Button>
          </div>
        </header>

        {!risksLoading && values.risks.length == 0 && (
          <Trans>No risks yet. Try adding some system tags.</Trans>
        )}
        <RiskSections
          {...{
            risks: values.risks,
            setFieldValue,
            submitForm,
            tags,
            searchTags,
            allPrecedents,
            risksLoading,
            removeRisk,
            changeSort,
            updateRisk,
          }}
        />
      </section>
    </Form>
  );
}

const AboutSystem = ({ formAbout, debouncedSetFieldValue }) => {
  const [about, setAbout] = useState(formAbout);

  const { t } = useTranslation();

  return (
    <section>
      <Label for="about-system">
        <Trans>About System</Trans>
      </Label>
      <Textarea
        placeholder={t(`Human-readable notes on the system under investigation`)}
        value={about}
        row={4}
        onChange={(event) => {
          setAbout(event.target.value);
          debouncedSetFieldValue('about', event.target.value);
        }}
      />
    </section>
  );
};

const QueryTagInput = ({
  title,
  id,
  labelKey,
  include,
  idValue,
  tags,
  setFieldValue,
  placeHolder,
}) => (
  <div className="bootstrap">
    <Label for={id}>{title}</Label>
    <Tags
      id={id}
      value={idValue}
      options={tags.filter((tag) => include(tag.split(':')))}
      onChange={(value) => {
        setFieldValue(id, value);
      }}
      labelKey={labelKey}
      placeHolder={placeHolder}
    />
  </div>
);

const GoalsTagInput = ({ values, tags, setFieldValue }) => (
  <QueryTagInput
    {...{
      title: 'Goals',
      id: 'tags_goals',
      idValue: values['tags_goals'],
      labelKey: abbreviatedTag,
      include: (tagParts) =>
        tagParts[0] == 'GMF' && ['Known AI Goal', 'Potential AI Goal'].includes(tagParts[1]),
      ...{ tags, setFieldValue },
      placeHolder: 'Goals for which to list associated risks',
    }}
  />
);

const MethodsTagInput = ({ values, tags, setFieldValue }) => (
  <QueryTagInput
    {...{
      title: 'Methods',
      id: 'tags_methods',
      idValue: values['tags_methods'],
      labelKey: abbreviatedTag,
      include: (tagParts) =>
        tagParts[0] == 'GMF' &&
        ['Known AI Technology', 'Potential AI Technology'].includes(tagParts[1]),
      ...{ tags, setFieldValue },
      placeHolder: 'Methods for which to list associated risks',
    }}
  />
);

const OtherTagInput = ({ values, tags, setFieldValue }) => (
  <QueryTagInput
    {...{
      title: 'Other',
      id: 'tags_other',
      idValue: values['tags_other'],
      labelKey: (tag) => tag,
      include: (tagParts) =>
        tagParts[0] != 'GMF' ||
        ![
          'Known AI Goal',
          'Potential AI Goal',
          'Known AI Technology',
          'Potential AI Technology',
        ].includes(tagParts[1]),
      ...{ tags, setFieldValue },
      placeHolder: 'Other tags for which to list associated risks',
    }}
  />
);

const Header = (props) => (
  <header {...{ ...props, className: `titleWrapper ${props.className}` }}>{props.children}</header>
);

const HeaderRow = (props) => (
  <div
    {...{
      ...props,
      className: `w-full flex items-center flex-wrap justify-between gap-3 ${props.className}`,
    }}
  >
    {props.children}
  </div>
);

const HeaderControls = (props) => (
  <div
    {...{
      ...props,
      className: `flex flex-wrap md:flex-nowrap shrink-0 gap-2 items-center max-w-full ${props.className}`,
    }}
  >
    {props.children}
  </div>
);

const SideBySide = (props) => (
  <div
    {...{
      ...props,
      className: `flex flex-col md:flex-row gap-2 [&>*]:w-full [&>*]:md:w-1/2 [&>*]:h-full ${props.className}`,
    }}
  >
    {props.children}
  </div>
);

// TODO: Unless the network connection is fairly slow
// (check with throttling in browser devtools),
// submissions happen fast enough that this never rerenders with
// isSubmitting == true.
// This needs to be better optimized for the render cycle.
function SavingIndicator({ isSubmitting, submissionError }) {
  const className = 'text-lg text-gray-500 inline-block mx-4';

  if (isSubmitting) {
    return (
      <span {...{ className }}>
        <Spinner />
        <Trans>Saving...</Trans>
      </span>
    );
  } else if (submissionError) {
    return (
      <span {...{ className }}>
        <Spinner />
        <Trans>Error saving...</Trans>
      </span>
    );
  } else {
    return (
      <span {...{ className }}>
        <Trans>Saved</Trans>
      </span>
    );
  }
}

function Info({ children, className }) {
  const [hide, setHide] = useState(false);

  if (hide) return <></>;
  return (
    <div
      className={`${className} bg-amber-50 text-amber-900 border border-amber-300 p-4 rounded shadow-md my-4`}
    >
      <button
        className="border-0 bg-none float-right text-xl pl-4 mt-0 pb-2 -mt-2"
        onClick={() => setHide(true)}
      >
        ×
      </button>
      <strong>INFO</strong>: {children}
    </div>
  );
}

// Hits the risk management API with the specified query tags
// to populate values.risks and allPrecedents.
//
// Example resulting values.risks:
//
// [ { "tag": "GMF:Failure:Gaming Vulnerability",
//     "precedents": [
//       { "incident_id": 146,
//         "url": "https://incidentdatabase.ai/cite/146",
//         "title": "Research Prototype AI, Delphi, Reportedly Gave Racially Biased Answers on Ethics",
//         "description": "A publicly accessible research model[...]moral judgments.",
//         "tags": [ "GMF:Known AI Technology:Language Modeling", ],
//         "risk_tags": [ "GMF:Known AI Technical Failure:Distributional Bias", ]
//       },
//     ]
//   }
// ]
//
// TODO: Group known and potential in GMF Taxonomy
const searchRisks = async ({
  values,
  setFieldValue,
  setRisksLoading,
  setAllPrecedents,
  t,
  addToast,
}) => {
  const queryTags = [...values['tags_goals'], ...values['tags_methods'], ...values['tags_other']];

  if (queryTags.length == 0) return;

  setRisksLoading(true);
  const response = await fetch(
    '/api/riskManagement/v1/risks?tags=' + encodeURIComponent(queryTags.join('___'))
  );

  const allPrecedents = [];

  if (response.ok) {
    const results = await response.json();

    const risksToAdd = [];

    for (let i = 0; i < results.length; i++) {
      const result = results[i];

      const newRisk = {
        ...emptyRisk(),
        title: abbreviatedTag(result.tag),
        tags: [result.tag],
        precedents: result.precedents,
        description: result.description,
        startClosed: true,
      };

      const notDuplicate = [...risksToAdd, ...values.risks].every(
        (existingRisk) => !areDuplicates(existingRisk, newRisk)
      );

      if (notDuplicate) {
        risksToAdd.push(newRisk);
      }
      for (const precedent of result.precedents) {
        if (allPrecedents.every((p) => p.incident_id != precedent.incident_id)) {
          allPrecedents.push(precedent);
        }
      }
    }
    setAllPrecedents(allPrecedents);

    setFieldValue('risks', values.risks.concat(risksToAdd));
  } else {
    addToast({
      message: t('Failure searching for risks.'),
      severity: SEVERITY.danger,
    });
  }

  setRisksLoading(false);
};

function areDuplicates(A, B) {
  return (
    A.tags.length == B.tags.length &&
    A.tags.every((aTag) => B.tags.some((bTag) => shouldBeGrouped(bTag, aTag))) &&
    B.tags.every((bTag) => A.tags.some((aTag) => shouldBeGrouped(aTag, bTag)))
  );
}
