import React, { useEffect, useState, useRef } from 'react';
import { Form } from 'formik';
import { Button, Textarea, Spinner } from 'flowbite-react';
import { Trans, useTranslation } from 'react-i18next';
import { useQuery, useMutation, gql } from '@apollo/client';
import { LocalizedLink } from 'plugins/gatsby-theme-i18n';
import debounce from 'lodash/debounce';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faBullseye,
  faMicrochip,
  faArrowsTurnToDots,
  faTag,
} from '@fortawesome/free-solid-svg-icons';

import { DELETE_CHECKLIST } from '../../graphql/checklists';
import { Label, DeleteButton, abbreviatedTag, generateId } from 'utils/checklists';
import Tags from 'components/forms/Tags';
import EditableLabel from 'components/checklists/EditableLabel';
import ExportDropdown from 'components/checklists/ExportDropdown';
import RiskSections from 'components/checklists/RiskSections';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { useUserContext } from '../../contexts/userContext';

export default function CheckListForm({
  values,
  handleSubmit,
  setFieldValue,
  submitForm,
  tags,
  isSubmitting,
  submissionError,
  users,
}) {
  const { user } = useUserContext();

  const userIsOwner = values.owner_id == user.id;

  const owner = users.find((u) => u.userId == values.owner_id);

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

  const searchTags = [
    ...(values['tags_goals'] || []),
    ...(values['tags_methods'] || []),
    ...(values['tags_other'] || []),
  ];

  // Hits the risk management API with the specified query tags
  // to populate values.risks and allPrecedents.
  //
  // Example resulting values.risks:
  //
  // [ {
  //     /* GraphQL API Results */
  //     title: "Gaming Vulnerability",
  //     tags: ["GMF:Failure:Gaming Vulnerability"],
  //     precedents: [
  //       { incident_id: 146,
  //         url: "https://incidentdatabase.ai/cite/146",
  //         title: "Research Prototype AI, Delphi, Reportedly Gave Racially Biased Answers on Ethics",
  //         description: "A publicly accessible research model [...] moral judgments.",
  //         tags: [ "GMF:Known AI Technology:Language Modeling", ],
  //       },
  //     ],
  //
  //     /* Defaults Risk Annotations */
  //     risk_status: "Not Mitigated",
  //     risk_notes: "",
  //     severity: "",
  //
  //
  //     /* UI properties*/
  //     startClosed: true,
  //     touched: false,     // TODO: Remove these database-side.
  //     generated: true,
  //   }
  // ]
  //
  // TODO: Group known and potential in GMF Taxonomy
  const {
    data: generatedRisksData,
    loading: generatedRisksLoading,
    error: generatedRisksErrors,
  } = useQuery(
    gql`
      query FindRisks {
        risks(input: { tags: [${searchTags.map((t) => `"${t}"`).join(', ')}] }) {
          tags
          title
          precedents {
            incident_id
            title
            description
            tags
          }
        }
      }
    `,
    { skip: searchTags.length == 0 }
  );

  if (generatedRisksErrors) {
    addToast({
      message: t('Failure searching for risks.'),
      severity: SEVERITY.danger,
      error: generatedRisksErrors,
    });
  }

  const generatedRisks = (generatedRisksData?.risks || []).map((result) => ({
    title: result.title,
    tags: result.tags,
    precedents: result.precedents,
    description: result.description,
    risk_status: 'Not Mitigated',
    risk_notes: '',
    severity: '',
    likelihood: '',
  }));

  const allPrecedents = generatedRisks.reduce((allPrecedents, generatedRisk) => {
    const newPrecedents = generatedRisk.precedents.filter((precedent) =>
      allPrecedents.every(
        (existingPrecedent) => existingPrecedent.incident_id != precedent.incident_id
      )
    );

    return allPrecedents.concat(newPrecedents);
  }, []);

  useEffect(() => {
    if (userIsOwner) {
      submitForm();
    }
  }, [values]);

  const debouncedSetFieldValue = useRef(debounce(setFieldValue, 1000)).current;

  const removeRisk = (findFunction) => {
    setFieldValue(
      'risks',
      values.risks.filter((risk) => !findFunction(risk))
    );
  };

  const addRisk = (newRisk) => {
    setFieldValue('risks', [newRisk].concat(values.risks));
  };

  const changeSort = (sortFunction) => (event) => {
    event.preventDefault();
    setFieldValue('risks', [...values.risks].sort(sortFunction));
  };

  const updateRisk = (risk, attributeValueMap) => {
    const updatedRisks = JSON.parse(JSON.stringify(values.risks));

    const oldRisk = updatedRisks.find((r) => r.id == risk.id);

    if (oldRisk) {
      const updatedRisk = { ...oldRisk };

      for (const attribute in attributeValueMap) {
        updatedRisk[attribute] = attributeValueMap[attribute];
      }
      updatedRisks.splice(updatedRisks.indexOf(oldRisk), 1);

      updatedRisks.push(updatedRisk);
    } else {
      // A generated risk being promoted to a manual one
      updatedRisks.push({ ...risk, ...attributeValueMap, id: generateId() });
    }

    setFieldValue('risks', updatedRisks);
    submitForm();
  };

  return (
    <Form data-cy="checklist-form" onSubmit={handleSubmit}>
      <Header>
        <HeaderInfo>
          <LocalizedLink to="/apps/checklists" className="text-md">
            <Trans>Risk Checklists</Trans>
          </LocalizedLink>
          <h1 className="text-sm my-0">
            <EditableLabel
              title={values.name}
              onChange={(event) => debouncedSetFieldValue('name', event.target.value)}
              textClasses="text-2xl m-0"
              iconClasses="text-sm vertical-align leading-3"
              disabled={!userIsOwner}
            />
          </h1>
          {owner && owner.first_name && owner.last_name && (
            <div className="text-gray-600">
              {owner.first_name} {owner.last_name}
            </div>
          )}
        </HeaderInfo>
        <HeaderControls>
          <SavingIndicator className="mr-2" {...{ isSubmitting, submissionError }} />
          <Button color="light" onClick={() => alert('Coming soon')}>
            <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
            <Trans>Subscribe</Trans>
          </Button>
          {userIsOwner && (
            <DeleteButton type="button" onClick={() => confirmDeleteChecklist(values.id)}>
              <Trans>Delete</Trans>
            </DeleteButton>
          )}
          <ExportDropdown checklist={values} generatedRisks={generatedRisks} />
        </HeaderControls>
      </Header>
      <Info>
        This feature is in beta. Data entered is not guaranteed to be retained while in development.
      </Info>
      <Info>Checklists are not private data. They will appear in public database snapshots.</Info>
      <AboutSystem formAbout={values.about} {...{ debouncedSetFieldValue, userIsOwner }} />
      <section>
        <SideBySide className="my-4">
          <GoalsTagInput {...{ values, tags, setFieldValue, userIsOwner }} />
          <MethodsTagInput {...{ values, tags, setFieldValue, userIsOwner }} />
        </SideBySide>
        <OtherTagInput {...{ values, tags, setFieldValue, userIsOwner }} />
      </section>
      <section>
        <RiskSections
          {...{
            risks: values.risks,
            generatedRisks,
            generatedRisksLoading,
            setFieldValue,
            submitForm,
            tags,
            searchTags,
            allPrecedents,
            addRisk,
            removeRisk,
            updateRisk,
            changeSort,
            userIsOwner,
          }}
        />
      </section>
    </Form>
  );
}

const AboutSystem = ({ formAbout, debouncedSetFieldValue, userIsOwner }) => {
  const [about, setAbout] = useState(formAbout);

  const { t } = useTranslation();

  return (
    <section>
      <Label for="about-system">
        <FontAwesomeIcon icon={faMicrochip} className="mr-2" />
        <Trans>About System</Trans>
      </Label>
      <Textarea
        data-cy="about"
        placeholder={t(`Human-readable notes on the system under investigation`)}
        value={about}
        rows={4}
        onChange={(event) => {
          setAbout(event.target.value);
          debouncedSetFieldValue('about', event.target.value);
        }}
        disabled={!userIsOwner}
      />
    </section>
  );
};

const QueryTagInput = ({
  title,
  id,
  include,
  idValue,
  tags,
  setFieldValue,
  placeHolder,
  userIsOwner,
  icon,
  trimTaxonomy = false,
}) => {
  const [realValue, setRealValue] = useState(idValue);

  useEffect(() => {
    setFieldValue(id, realValue);
  }, [realValue]);

  return (
    <div className="bootstrap">
      <Label for={id}>
        {icon && <FontAwesomeIcon icon={icon} className="mr-2" />}
        {title}
      </Label>
      <Tags
        id={id}
        inputId={`${id}_input`}
        value={realValue}
        options={tags.filter((tag) => include(tag.split(':')))}
        onChange={(tagInputArray) => {
          //
          // Example tagInputArray:
          //
          // ["GMF:Known AI Technology:Transformer", "Language Model"]
          //     |                                         |
          //  ,  |    Not fully-qualified, entered by direct text entry
          //     |    when `trimTaxonomy` is enabled. Needs to be resolved to:
          //     |    "GMF:Known AI Technology:Language Model"
          //     |
          //  Fully-qualified, entered from menu
          //
          if (trimTaxonomy) {
            // If `trimTaxonomy` is enabled, then
            // "GMF:Known AI Technology:Transformer"
            // displays in the menu as just "Transformer".
            // Users would therefore expect that typing "Transformer"
            // will mean the same thing as clicking "Transformer" in the menu.
            // So we have to convert it to its fully-qualified version.
            const selectedTags = [];

            for (const tagInput of tagInputArray) {
              let selectedTag;

              if (tagInput.includes(':')) {
                // If there's a colon, it's already fully-qualified,
                selectedTag = tagInput;
              } else {
                // If there's no colon, then it's not fully-qualified,
                // so we find the full tag which abbreviates
                // to the unqualified one.
                selectedTag = tags.find((t) => abbreviatedTag(t) == tagInput);
              }
              if (selectedTag) {
                selectedTags.push(selectedTag);
              }
            }
            setRealValue(selectedTags);
          } else {
            // If `trimTaxonomy` is disabled,
            // then we can leave the input as it is.
            setRealValue(tagInputArray);
          }
        }}
        labelKey={trimTaxonomy ? abbreviatedTag : (a) => a}
        placeHolder={placeHolder}
        disabled={!userIsOwner}
        allowNew={false}
      />
    </div>
  );
};

const GoalsTagInput = ({ values, tags, setFieldValue, userIsOwner }) => (
  <QueryTagInput
    {...{
      title: 'Goals',
      id: 'tags_goals',
      icon: faBullseye,
      idValue: values['tags_goals'],
      trimTaxonomy: true,
      include: (tagParts) =>
        tagParts[0] == 'GMF' &&
        ['Known AI Goal', 'Potential AI Goal'].includes(tagParts[1]) &&
        tagParts[2] &&
        tagParts[2] !== 'null',
      placeHolder: 'Goals for which to list associated risks',
      ...{ tags, setFieldValue, userIsOwner },
    }}
  />
);

const MethodsTagInput = ({ values, tags, setFieldValue, userIsOwner }) => (
  <QueryTagInput
    {...{
      title: 'Methods',
      id: 'tags_methods',
      icon: faArrowsTurnToDots,
      idValue: values['tags_methods'],
      trimTaxonomy: true,
      include: (tagParts) =>
        tagParts[0] == 'GMF' &&
        ['Known AI Technology', 'Potential AI Technology'].includes(tagParts[1]) &&
        tagParts[2] &&
        tagParts[2] !== 'null',
      placeHolder: 'Methods for which to list associated risks',
      ...{ tags, setFieldValue, userIsOwner },
    }}
  />
);

const OtherTagInput = ({ values, tags, setFieldValue, userIsOwner }) => (
  <QueryTagInput
    {...{
      title: 'Other',
      id: 'tags_other',
      icon: faTag,
      idValue: values['tags_other'],
      include: (tagParts) =>
        tagParts[0] != 'GMF' ||
        ![
          'Known AI Goal',
          'Potential AI Goal',
          'Known AI Technology',
          'Potential AI Technology',
        ].includes(tagParts[1]),
      placeHolder: 'Other tags for which to list associated risks',
      ...{ tags, setFieldValue, userIsOwner },
    }}
  />
);

const Header = (props) => {
  const className = `
    border-[rgb(230,236,241)] border-b-[1px]
    lg:min-h-[5.5rem]
    flex justify-between flex-wrap gap-4
    pb-2 -mt-2
    ${props.className || ''}
  `;

  return <header {...{ ...props, className }}>{props.children}</header>;
};

const HeaderInfo = (props) => {
  const className = `flex flex-col justify-center ${props.className || ''}`;

  return <div {...{ ...props, className }}>{props.children}</div>;
};

const HeaderControls = (props) => {
  const className = `flex flex-wrap md:flex-nowrap shrink-0 gap-2 items-center max-w-full ${
    props.className || ''
  }`;

  return <div {...{ ...props, className }}>{props.children}</div>;
};

const SideBySide = (props) => {
  const className = `
    flex flex-col md:flex-row gap-2
    [&>*]:w-full [&>*]:md:w-1/2
    [&>*]:h-full 
    ${props.className || ''}
  `;

  return <div {...{ ...props, className }}>{props.children}</div>;
};

function SavingIndicator({ isSubmitting, submissionError, className }) {
  className = `text-lg text-gray-500 inline-block ${className || ''}`;

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
      className={`${
        className || ''
      } bg-amber-50 text-amber-900 border border-amber-300 p-4 rounded shadow-md my-4`}
    >
      <button
        className="border-0 bg-none float-right text-xl pl-4 pb-2 -mt-3"
        onClick={() => setHide(true)}
      >
        ×
      </button>
      <strong>INFO</strong>: {children}
    </div>
  );
}
