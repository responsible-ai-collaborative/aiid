import React, { useState } from 'react';
import Layout from 'components/Layout';
import { useTranslation } from 'react-i18next';
import { Button, TextInput, Textarea } from 'flowbite-react';
import { debounce } from 'debounce';
import {
  useQueryParams,
  StringParam,
  createEnumParam,
  withDefault,
  NumberParam,
  BooleanParam
} from 'use-query-params';

import AiidHelmet from 'components/AiidHelmet';
import Tags from 'components/forms/Tags.js';
import { Formik } from 'formik';

export default function ChecklistsPage(props) {
  const {
    location: { pathname },
  } = props;

  const [query, setQuery] = useQueryParams({
    id: StringParam,
  });

  const { t } = useTranslation();

  const updateQuery = () => {};

  return (
    <Layout {...props} className="md:max-w-5xl">
      <AiidHelmet path={pathname}>
        <title>{t('Risk Checklists')}</title>
      </AiidHelmet>
      {query.id ? (
        <Formik initialValues={{'tags-goals': [], 'tags-methods': [], 'tags-other': []}} >
          {({ values, handleChange, handleSubmit, setFieldTouched, setFieldValue, isSubmitting }) => (
            <>
              <section className="flex flex-col gap-4">
                <h1>Risk Checklist for ""</h1>

                <label for="about-system">About System</label>
                <Textarea row={4} />

                <div className="flex gap-2">
                  {[{title: 'Goals', id: 'tags-goals'},
                    {title: 'Methods', id: 'tags-methods'},
                    {title: 'Other Tags', id: 'tags-other'},
                  ].map(e => (
                    <div className="bootstrap">
                      <label for={e.id}>{e.title}</label>
                      <Tags id={e.id} value={values[e.id]} onChange={(value) => {
                        setFieldValue(e.id, value);
                      }}/>
                    </div>
                  ))}
                </div>
              </section>
              <section>
                <div class="flex space-between">
                  <h2>Risks</h2>
                  <Button>Add Risk</Button>
                </div>
                <p><Trans>Risks are surface automatically based on the tags applied to the system. They can also be added manually. Each risk is associated with a query for precedent incidents, which can be modified to suit your needs. You can subscribe both to new risks and new precedent incidents.</Trans></p>
              </section>
            <>
          )}
        </Formik>
      ) : (
        <h1>Risk Checklists</h1>
      )}
    </Layout>
  );
};
