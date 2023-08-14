import React, { useEffect, useState } from 'react';
import { Form } from 'formik';
import { Button, Textarea, Spinner } from 'flowbite-react';
import { Trans, useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { LocalizedLink } from 'plugins/gatsby-theme-i18n';
import { useExpanded, useFilters, usePagination, useSortBy, useTable } from 'react-table';

import Table, { DefaultColumnFilter, DefaultColumnHeader } from 'components/ui/Table';
import { DELETE_CHECKLIST } from '../../graphql/checklists';
import { classy, classyDiv } from 'utils/classy';
import { Label, DeleteButton, abbreviatedTag, emptyRisk } from 'utils/checklists';
import Tags from 'components/forms/Tags';
import RiskSection from 'components/checklists/RiskSection';
import EditableLabel from 'components/checklists/EditableLabel';
import ExportDropdown from 'components/checklists/ExportDropdown';


export default function CheckListForm({
  values,
  handleSubmit,
  setFieldValue,
  submitForm,
  tags,
  isSubmitting,
}) {
  const { t } = useTranslation();

  const [deleteChecklist] = useMutation(DELETE_CHECKLIST);

  const confirmDeleteChecklist = async (id) => {
    if (window.confirm('Delete this checklist?')) {
      try {
        await deleteChecklist({ variables: { query: { id } } });
        window.location = '/apps/checklists/';
      } catch (e) {
        console.log(e);
      }
    }
  };

  const [saveStatus, setSaveStatus] = useState(null);

  const [risksLoading, setRisksLoading] = useState(false);

  const [allPrecedents, setAllPrecedents] = useState([]);

  const searchTags = [...values['tags_goals'], ...values['tags_methods'], ...values['tags_other']];

  useEffect(() => {
    searchRisks({ values, setFieldValue, setRisksLoading, setAllPrecedents, setSaveStatus });
  }, [values['tags_goals'], values['tags_methods'], values['tags_other']]);

  const oldSetFieldValue = setFieldValue;

  setFieldValue = (key, value) => {
    oldSetFieldValue(key, value);
    submitForm();
  };

//  const columns = React.useMemo(() => {
//    const columns = [
//      {
//        title: t('Title'),
//        accessor: 'title' ,
//        Cell: ({ cell }) => {
//          return <>{cell.value}</>
//        },
//        filter: DefaultColumnFilter,
//        sortType: (rowA, rowB, id) => rowA.values[id].length - rowB.values[id].length
//      }
//    ];
//    return columns;
//  }, []);



//  const table = useTable({
//    columns,
//    data: [{title: 'Kitties'}],
//    defaultColumn: 'title',
//    initialState: { sortBy: [{ id: 'title', desc: true }] },
//    useFilters,
//    useSortBy,
//    useExpanded,
//    usePagination
//  });
//
  
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
              onChange={(event) => setFieldValue('name', event.target.value)}
              textClasses="text-2xl"
              iconClasses="text-lg vertical-align"
            />
          </h1>
          <HeaderControls>
            <SavingIndicator {...{ saveStatus }} />
            <Button color="light" onClick={() => alert('Coming soon')}>
              <Trans>Subscribe</Trans>
            </Button>
            <DeleteButton type="button" onClick={() => confirmDeleteChecklist(values.id)}>
              Delete
            </DeleteButton>
            <ExportDropdown checklist={values} />
          </HeaderControls>
        </HeaderRow>
      </Header>
      {/*<Info className="my-4">
        <Trans>
          Describe the system under investigation. Apply machine-readable tags to surface risks
          associate with likewise-tagged incidents in the database. These are the basis of a risk
          checklist.
        </Trans>
      </Info>*/}
      <section>
        <Label for="about-system">About System</Label>
        <Textarea
          placeholder={t(`Human-readable notes on the system under investigation`)}
          value={values.about}
          row={4}
          onChange={(event) => {
            setFieldValue('about', event.target.value);
          }}
        />
      </section>
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
              Expand all
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
              Collapse all
            </Button>
            <Button
              onClick={() => {
                setFieldValue('risks', [emptyRisk()].concat(values.risks || []));
              }}
            >
              Add Risk
            </Button>
          </div>
        </header>
        {/*<Info>
          <Trans>
            Risks are surfaced automatically based on the tags applied to the system. They can also
            be added manually. Each risk is associated with a query for precedent incidents, which
            can be modified to suit your needs. You can subscribe both to new risks and new
            precedent incidents.
          </Trans>
        </Info>*/}

        {!risksLoading && values.risks.length == 0 && (
          <Trans>No risks yet. Try adding some system tags.</Trans>
        )} 
        <RiskSections {...{
          values,
          setFieldValue,
          submitForm,
          tags,
          searchTags,
          allPrecedents,
          risksLoading,
        }} />
      </section>
    </Form>
  );
}

const RiskSections = ({
  values,
  setFieldValue,
  submitForm,
  tags,
  searchTags,
  allPrecedents,
  risksLoading,
}) => {

  const riskSectionProps = {
    values,
    setFieldValue,
    submitForm,
    tags,
    searchTags,
    allPrecedents,
  };

  return (
    <div className="flex flex-col gap-8 mt-8">
      {risksLoading ? ( 
        <>
          {(values.risks || []).filter(risk => !risk.generated).map((risk) => (
            <RiskSection key={risk.id} {...{...riskSectionProps, risk}} />
          ))}
          <div className="flex flex-row">
            <Spinner />{' '}
            <Trans>Searching for risks matching tags…</Trans>
          </div>
        </>
      ) : (
        (values.risks || []).map((risk) => (
          <RiskSection key={risk.id} {...{...riskSectionProps, risk}} />
        ))
      )}
    </div>
  );
}

const QueryTagInput = ({
  title,
  id,
  labelKey,
  include,
  values,
  tags,
  setFieldValue,
  placeHolder,
}) => (
  <div className="bootstrap">
    <Label for={id}>{title}</Label>
    <Tags
      id={id}
      value={values[id]}
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
      labelKey: abbreviatedTag,
      include: (tagParts) =>
        tagParts[0] == 'GMF' && ['Known AI Goal', 'Potential AI Goal'].includes(tagParts[1]),
      ...{ values, tags, setFieldValue },
      placeHolder: 'Goals for which to list associated risks',
    }}
  />
);

const MethodsTagInput = ({ values, tags, setFieldValue }) => (
  <QueryTagInput
    {...{
      title: 'Methods',
      id: 'tags_methods',
      labelKey: abbreviatedTag,
      include: (tagParts) =>
        tagParts[0] == 'GMF' &&
        ['Known AI Technology', 'Potential AI Technology'].includes(tagParts[1]),
      ...{ values, tags, setFieldValue },
      placeHolder: 'Methods for which to list associated risks',
    }}
  />
);

const OtherTagInput = ({ values, tags, setFieldValue }) => (
  <QueryTagInput
    {...{
      title: 'Other',
      id: 'tags_other',
      labelKey: (tag) => tag,
      include: (tagParts) =>
        tagParts[0] != 'GMF' ||
        ![
          'Known AI Goal',
          'Potential AI Goal',
          'Known AI Technology',
          'Potential AI Technology',
        ].includes(tagParts[1]),
      ...{ values, tags, setFieldValue },
      placeHolder: 'Other tags for which to list associated risks',
    }}
  />
);

const Header = classy('header', 'titleWrapper');

const HeaderRow = classyDiv('w-full flex items-center flex-wrap justify-between gap-3');

const HeaderControls = classyDiv(
  'flex flex-wrap md:flex-nowrap shrink-0 gap-2 items-center max-w-full'
);

const SideBySide = classyDiv(
  'flex flex-col md:flex-row gap-2 [&>*]:w-full [&>*]:md:w-1/2 [&>*]:h-full'
);

function SavingIndicator({ saveStatus }) {
  const className = 'text-lg text-gray-500 inline-block mx-4';

  if (!saveStatus) {
    return <></>
  }
  if (saveStatus == 'saving') {
    return (
      <span {...{ className }}>
        <Spinner />
        <Trans>Saving...</Trans>
      </span>
    );
  }
  if (saveStatus == 'saved') {
    return (
      <span {...{ className }}>
        <Trans>Saved</Trans>
      </span>
    );
  }
  if (saveStatus == 'error') {
    return (
      <span {...{ className }}>
        <Spinner />
        <Trans>Error saving...</Trans>
      </span>
    );
  }
}

function Info({ children, className }) {
  //  return <>{children}</>
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

const searchRisks = async ({ values, setFieldValue, setRisksLoading, setAllPrecedents, setSaveStatus }) => {
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
      };

      if (i > 0) {
        newRisk.startClosed = true;
      }
      if (!values.risks.some((existingRisk) => (existingRisk.tags || []).includes(result.tag))) {
        risksToAdd.push(newRisk);
      }
      for (const precedent of result.precedents) {
        if (
          allPrecedents.every((p) => {
            return p.incident_id != precedent.incident_id;
          })
        ) {
          allPrecedents.push(precedent);
        }
      }
    }
    setFieldValue('risks', values.risks.concat(risksToAdd));
    setAllPrecedents(allPrecedents);

    // Example result:
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
  } else {
    // TODO: Handle the error better
    setSaveStatus('error');
  }

  setRisksLoading(false);
};
