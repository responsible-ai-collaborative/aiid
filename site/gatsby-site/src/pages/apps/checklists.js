import React, { useState, useEffect, useRef } from 'react';
import Layout from 'components/Layout';
import { useTranslation } from 'react-i18next';
import { Button, TextInput, Textarea } from 'flowbite-react';
import { debounce } from 'debounce';
import { Trans } from 'react-i18next';
import { Formik, Form } from 'formik';
import { graphql } from 'gatsby';
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

export default function ChecklistsPage(props) {
  const {
    location: { pathname },
    data: { taxa, classifications }
  } = props;

//  const tags = (
//    taxa.nodes.map(
//      taxonomy => taxonomy.field_list.map(
//        field => (field.permitted_values || []).map(
//          value => [taxonomy.namespace, field.short_name, value].join(":")
//        )
//      ).reduce((all, partial) => all.concat(partial), [])
//    ).reduce((all, partial) => all.concat(partial), [])
//  );


  const [query, setQuery] = useQueryParams({
    id: StringParam,
  });

  const { t } = useTranslation();

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

//  const [risks, setRisks] = useState([{
//    title: 'Distributional Bias',
//    query_tags: [
//      'GMF:Known AI Risk:Distributional Bias',
//      'GMF:Known AI Goal:Question Answering',
//      'GMF:Known AI Technology:Language Modeling',
//      'CSET:Harm Distribution Basis:Race'
//    ],
//    risk_status: 'Not mitigated',
//    risk_notes: '',
//    severity: '',
//  }]);

  const updateQuery = () => {};

//  useEffect(() => {
//
//  }, [risk])

  const submit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    console.log(values);
    setSubmitting(false);
  }

  console.log(`taxa`, taxa);

  console.log(`classifications`, classifications);

  const tags = [];

  for (let classification of classifications.nodes) {
    
    const taxonomy = taxa.nodes.find(t => t.namespace == classification.namespace);

    for (let attribute of classification.attributes) {

      console.log(`attribute`, attribute);
      const field = taxonomy.field_list.find(
        f => {
          console.log(`f.short_name: ${f.short_name} == attribute.short_name: ${attribute.short_name}`, f.short_name == attribute.short_name);
          return f.short_name == attribute.short_name
        }
      );
      console.log(`field`, field);

      if (['enum', 'bool', 'multi', ].includes(field.display_type)) {
        tags.push(
          [ classification.namespace,
            attribute.short_name,
            JSON.parse(attribute.value_json)
          ].join(':')
        );
      } else if (field.display_type == 'list') {
        for (let value of JSON.parse(attribute.value_json)) {
          tags.push(
            [ classification.namespace,
              attribute.short_name,
              JSON.parse(attribute.value_json)
            ].join(':')
          );
        }
      }
    }
  }

  console.log(`tags`, tags);

  return (
    <Layout {...props} className="md:max-w-5xl">
      <AiidHelmet path={pathname}>
        <title>{t('Risk Checklists')}</title>
      </AiidHelmet>
      {hydrated && query.id ? (
        <Formik onSubmit={submit} initialValues={{'tags-goals': [], 'tags-methods': [], 'tags-other': [], 'risks': []}}  >
          {({ values, handleChange, handleSubmit, setFieldTouched, setFieldValue, isSubmitting, submitForm }) => {
            console.log(`values`, values);
            return (
            <Form onSubmit={handleSubmit}>
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
                  <Button onClick={() => setFieldValue('risks', (values.risks || []).concat({
                    title: 'Untitled Risk',
                    query_tags: [],
                    risk_status: 'Not mitigated',
                    risk_notes: '',
                    severity: '',
                  }))}>Add Risk</Button>
                </div>
                <p><Trans>Risks are surface automatically based on the tags applied to the system. They can also be added manually. Each risk is associated with a query for precedent incidents, which can be modified to suit your needs. You can subscribe both to new risks and new precedent incidents.</Trans></p>

                {(values.risks || []).map((risk) => (
                  <RiskSection {...{ risk, values, setFieldValue, submitForm }}/>
                ))}
              </section>
            </Form>
          )}}
        </Formik>
      ) : (
        <h1>Risk Checklists</h1>
      )}
    </Layout>
  );
};

function RiskSection({ risk, values, setRisks, setFieldValue, submitForm }) {
  const updateRisk = (attributeValueMap) => {

    const updatedRisks = [...values.risks];

    // TODO: Handle identity better than just comparing titles.
    const updatedRisk = updatedRisks.find(r => r.title == risk.title);

    for (const attribute in attributeValueMap) {
      updatedRisk[attribute] = attributeValueMap[attribute];
    }

    setFieldValue('risks', updatedRisks);
    submitForm();
  }

  return (
    <details>
      <summary>{risk.title}</summary>
      <div className="grid grid-cols-2 grid-rows-2 gap-4">
        <div>
          <label><Trans>Precedents Query</Trans></label>
          <div className="h-8 max-h-8" >
            <Tags 
              id="risk_status"
              labelKey={(tag) => tag.replace(/^.*:/g, '')}
              value={risk.query_tags}
              onChange={(value) => updateRisk({ query_tags: value })}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <div>
            <label>Risk Status</label>
            <br/>
            <select value={risk.risk_status} onChange={(event) => updateRisk({risk_status: event.target.value})}>
              {['Not Mitigated', 'Mitigated'].map((status) => (
                <option value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Severity</label>
            <TextInput value={risk.severity} onChange={(event) => updateRisk({severity: event.target.value})}/>
          </div>
        </div>
        <div>
          <label>Precedents</label>
        </div>
        <div>
          <label>Risk Notes</label>
          <Textarea value={risk.risk_notes} onChange={(event) => updateRisk({risk_notes: event.target.value})}/>
        </div>
      </div>
    </details>
  );
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
