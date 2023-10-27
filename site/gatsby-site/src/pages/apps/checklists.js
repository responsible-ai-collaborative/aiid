import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Spinner } from 'flowbite-react';
import { debounce } from 'debounce';
import { Formik } from 'formik';
import { graphql } from 'gatsby';
import { useQueryParams, StringParam } from 'use-query-params';
import { useQuery, useMutation } from '@apollo/client';

import AiidHelmet from 'components/AiidHelmet';
import CheckListForm from 'components/checklists/CheckListForm';
import ChecklistsIndex from 'components/checklists/ChecklistsIndex';
import { removeTypename, checkedRiskStatus } from 'utils/checklists';
import { FIND_CHECKLIST, UPDATE_CHECKLIST } from '../../graphql/checklists';

const ChecklistsPage = (props) => {
  const {
    location: { pathname },
    data,
  } = props;

  const [taxa, classifications, users] = ['taxa', 'classifications', 'users'].map(
    (e) => data[e]?.nodes
  );

  const { t } = useTranslation();

  return (
    <>
      <AiidHelmet path={pathname}>
        <title>{t('Risk Checklists')}</title>
      </AiidHelmet>
      <ChecklistsPageBody {...{ taxa, classifications, users }} />
    </>
  );
};

const ChecklistsPageBody = ({ taxa, classifications, users }) => {
  const [query] = useQueryParams({
    id: StringParam,
  });

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  const { data: savedChecklistData, loading: savedChecklistLoading } = useQuery(FIND_CHECKLIST, {
    variables: { query: { id: query.id } },
  });

  const savedChecklist =
    savedChecklistData?.checklist && removeTypename(savedChecklistData.checklist);

  const [saveChecklist] = useMutation(UPDATE_CHECKLIST);

  const debouncedSaveChecklist = useRef(debounce(saveChecklist, 3000)).current;

  const [submissionError, setSubmissionError] = useState(null);

  const submit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    setSubmissionError(null);

    const save = removeTypename({
      variables: {
        query: { id: query.id },
        checklist: {
          ...values,
          id: query.id,
          risks: (values.risks || [])
            .filter((risk) => !risk.generated)
            .map((risk) => ({
              ...risk,
              risk_status: checkedRiskStatus(risk.risk_status),
              startClosed: undefined,
            })),
        },
      },
    });

    try {
      await debouncedSaveChecklist(save);
    } catch (error) {
      setSubmissionError(error);
    }
    setSubmitting(false);
  };

  const tags = classificationsToTags({ classifications, taxa });

  if (!hydrated) {
    // We need this to convince Tailwind
    // to include the dynamically-generated color classes in the bundle.
    return (
      <div className="hidden bg-red-200 text-red-900 bg-orange-200 text-orange-900 bg-purple-200 text-purple-900 bg-green-200 text-green-900 bg-lime-200 text-lime-900 text-gray-400 text-red-700" />
    );
  }

  if (!query.id) {
    return (
      <>
        <ChecklistsIndex {...{ users }} />
      </>
    );
  }
  if (query.id && savedChecklistLoading) {
    return <Spinner />;
  }
  if (query.id && savedChecklist) {
    return (
      <Formik onSubmit={submit} initialValues={savedChecklist}>
        {(FormProps) => <CheckListForm {...{ ...FormProps, tags, users, submissionError }} />}
      </Formik>
    );
  }
};

const classificationsToTags = ({ classifications, taxa }) => {
  const tags = new Set();

  for (const classification of classifications) {
    if (!classification.publish) continue;

    const taxonomy = taxa.find((t) => t.namespace == classification.namespace);

    for (const attribute of classification.attributes) {
      const field = taxonomy.field_list.find((f) => f.short_name == attribute.short_name);

      if (field) {
        const value = JSON.parse(attribute.value_json);

        if (Array.isArray(value)) {
          for (const item of value) {
            if (isTag({ value: item, field })) {
              tags.add([classification.namespace, attribute.short_name, String(item)].join(':'));
            }
          }
        } else if (isTag({ value, field })) {
          tags.add([classification.namespace, attribute.short_name, String(value)].join(':'));
        }
      }
    }
  }
  return Array.from(tags);
};

const isTag = ({ value, field }) =>
  value &&
  typeof value !== 'object' &&
  String(value).length < 20 &&
  String(value).length > 0 &&
  field.display_type != 'long_string';

export const query = graphql`
  query ChecklistsPageQuery {
    taxa: allMongodbAiidprodTaxa {
      nodes {
        id
        namespace
        weight
        description
        complete_entities
        dummy_fields {
          field_number
          short_name
        }
        field_list {
          field_number
          short_name
          long_name
          short_description
          long_description
          display_type
          mongo_type
          default
          placeholder
          permitted_values
          weight
          instant_facet
          required
          public
          complete_from {
            all
            current
            entities
          }
          subfields {
            field_number
            short_name
            long_name
            short_description
            long_description
            display_type
            mongo_type
            default
            placeholder
            permitted_values
            weight
            instant_facet
            required
            public
            complete_from {
              all
              current
              entities
            }
          }
        }
      }
    }
    users: allMongodbCustomDataUsers {
      nodes {
        userId
        first_name
        last_name
      }
    }
    classifications: allMongodbAiidprodClassifications {
      nodes {
        namespace
        attributes {
          short_name
          value_json
        }
        publish
      }
    }
  }
`;

export default ChecklistsPage;
