import React, { useState, useEffect, useRef } from 'react';
import Layout from 'components/Layout';
import { useTranslation } from 'react-i18next';
import { Spinner } from 'flowbite-react';
import { debounce } from 'debounce';
import { Formik } from 'formik';
import { graphql } from 'gatsby';
import { useQueryParams, StringParam } from 'use-query-params';
import { useQuery, useMutation } from '@apollo/client';

import AiidHelmet from 'components/AiidHelmet';
import CheckListForm from 'components/checklists/CheckListForm';
import { FIND_CHECKLIST, UPDATE_CHECKLIST } from '../../graphql/checklists';

export default function ChecklistsPage(props) {
  const {
    location: { pathname },
    data: { taxa, classifications },
  } = props;

  const [query] = useQueryParams({
    id: StringParam,
  });

  const { t } = useTranslation();

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  const { data: savedChecklistData, loading: savedChecklistLoading } = useQuery(FIND_CHECKLIST, {
    variables: { query: { id: query.id } },
  });

  const savedChecklist = !savedChecklistLoading && removeTypename(savedChecklistData.checklist);

  const [saveChecklist] = useMutation(UPDATE_CHECKLIST);

  const debouncedSaveChecklist = useRef(debounce(saveChecklist, 3000)).current;

  const submit = async (values, { setSubmitting }) => {
    setSubmitting(true);

    const save = removeTypename({
      variables: {
        query: { id: query.id },
        checklist: {
          ...values,
          id: query.id,
          risks: [...values.risks].map((risk) => ({ ...risk, startClosed: undefined })),
        },
      },
    });

    await debouncedSaveChecklist(save);
    setSubmitting(false);
  };

  const tags = classificationsToTags({ classifications, taxa });

  return (
    <Layout {...props} className="w-full md:max-w-5xl">
      <AiidHelmet path={pathname}>
        <title>{t('Risk Checklists')}</title>
      </AiidHelmet>
      {hydrated && query.id ? (
        savedChecklistLoading ? (
          <Spinner />
        ) : (
          <Formik
            onSubmit={submit}
            initialValues={
              savedChecklist || {
                name: 'Untitled System',
                about: '',
                tags_goals: [],
                tags_methods: [],
                tags_other: [],
                risks: [],
              }
            }
          >
            {(FormProps) => <CheckListForm {...{ ...FormProps, tags, t }} />}
          </Formik>
        )
      ) : (
        <h1>Risk Checklists</h1>
      )}
    </Layout>
  );
}

function classificationsToTags({ classifications, taxa }) {
  const tags = new Set();

  for (const classification of classifications.nodes) {
    const taxonomy = taxa.nodes.find((t) => t.namespace == classification.namespace);

    for (const attribute of classification.attributes) {
      const field = taxonomy.field_list.find((f) => f.short_name == attribute.short_name);

      if (field) {
        const value = JSON.parse(attribute.value_json);

        if (Array.isArray(value)) {
          for (const item of value) {
            if (String(item).length < 20) {
              tags.add([classification.namespace, attribute.short_name, String(item)].join(':'));
            }
          }
        } else if (String(value).length < 20) {
          tags.add([classification.namespace, attribute.short_name, String(value)].join(':'));
        }
      }
    }
  }
  return Array.from(tags);
}

function removeTypename(obj) {
  const replaced = JSON.stringify(obj).replace(/"__typename":"[A-Za-z]*",/g, '');

  return JSON.parse(replaced);
}

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
