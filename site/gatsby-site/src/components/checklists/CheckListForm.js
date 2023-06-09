import React, { useEffect, useState } from 'react';
import { Form } from 'formik';
import { Button, Select, TextInput, Textarea, Card, Spinner } from 'flowbite-react';
import { Trans } from 'react-i18next';

import { classyDiv } from 'utils/classy';
import { Label, abbreviatedTag, emptyRisk, risksEqual } from 'utils/checklists';
import Tags from 'components/forms/Tags';
import RiskSection from 'components/checklists/RiskSection';

export default function CheckListForm({ 
  values, handleChange, handleSubmit, setFieldTouched, 
  setFieldValue, isSubmitting, submitForm, tags, t 
}) {

  const [risksLoading, setRisksLoading] = useState(false);

  const [allPrecedents, setAllPrecedents] = useState([]);

  const searchTags = [
    ...values['tags_goals'],
    ...values['tags_methods'],
    ...values['tags_other']
  ];

  useEffect(() => { searchRisks({ values, setFieldValue, setRisksLoading, setAllPrecedents }) }, [
    values['tags_goals'],
    values['tags_methods'],
    values['tags_other']
  ])

  const oldSetFieldValue = setFieldValue;
  setFieldValue = (key, value) => {
    oldSetFieldValue(key, value);
    submitForm();
  }

  return (
    <Form onSubmit={handleSubmit}>
      <h1>Risk Checklist for ""</h1>
      <section className="flex flex-col gap-4">
        <Row>
          <Label for="about-system">About System</Label>
          <Textarea row={4} />
        </Row>
        <Row className="flex gap-2">
          <Col className="w-1/2 h-full">
            <QueryTagInput {...{
              title: 'Goals', 
              id: 'tags_goals', 
              labelKey: abbreviatedTag,
              include: tagParts => (
                tagParts[0] == 'GMF' && 
                ["Known AI Goal", "Potential AI Goal"].includes(tagParts[1])
              ),
              ...{values, tags, setFieldValue}
            }}/>
          </Col>
          <Col className="w-1/2 f-full">
            <QueryTagInput {...{
              title: 'Methods', 
              id: 'tags_methods', 
              labelKey: abbreviatedTag,
              include: tagParts => (
                tagParts[0] == 'GMF' && 
                ["Known AI Technology", "Potential AI Technology"].includes(tagParts[1])
              ),
              ...{values, tags, setFieldValue}
            }}/>
          </Col>
        </Row>
        <Row>
          <QueryTagInput {...{
            title: 'Other', 
            id: 'tags_other', 
            labelKey: (tag) => tag,
            include: tagParts => (
              tagParts[0] != 'GMF' || ![
                "Known AI Goal", 
                "Potential AI Goal",
                "Known AI Technology",
                "Potential AI Technology"
              ].includes(tagParts[1])
            ),
            ...{values, tags, setFieldValue}
          }}/>
        </Row>
      </section>
      <section>
        <header class="flex justify-between mt-6">
          <h2>Risks</h2>
          <Button onClick={() => {
            setFieldValue(
              'risks', [emptyRisk()].concat(values.risks || [])
            )
          }}>Add Risk</Button>
        </header>
        <p><Trans>Risks are surfaced automatically based on the tags applied to the system. They can also be added manually. Each risk is associated with a query for precedent incidents, which can be modified to suit your needs. You can subscribe both to new risks and new precedent incidents.</Trans></p>

        {risksLoading ? (
            <Spinner />
          ) : (
            <div className="flex flex-col gap-6">
              {(values.risks || []).map((risk) => (
                <RiskSection key={risk.id} {...{ risk, values, setFieldValue, submitForm, tags, searchTags, allPrecedents }}/>
              ))}
            </div>
          )
        }
      </section>
    </Form>
  )
}

var QueryTagInput = ({ title, id, labelKey, include, values, tags, setFieldValue }) => (
  <div className="bootstrap">
    <Label for={id}>{title}</Label>
    <Tags 
      id={id}
      value={values[id]}
      options={tags.filter(tag => include(tag.split(":")))}
      onChange={(value) => { setFieldValue(id, value); }}
      labelKey={labelKey}
    />
  </div>
);

var Row = classyDiv();
var Col = classyDiv();

var searchRisks = async ({ values, setFieldValue, setRisksLoading, setAllPrecedents }) => {
  const queryTags = [...values['tags_goals'], ...values['tags_methods'], ...values['tags_other']];
  if (queryTags.length == 0) {
    setFieldValue('risks', []);
    return;
  }
  setRisksLoading(true);
  const response = await fetch(
    '/api/riskManagement/v1/risks?tags=' +
    encodeURIComponent(queryTags.join('___'))
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
      if (!values.risks.some(existingRisk => (existingRisk.tags || []).includes(result.tag))) {
        risksToAdd.push(newRisk);
      }
      /*allPrecedents = allPrecedents.concat(
        result.precedents.filter(
          precedent => !allPrecedents.some(
            existingPrecedent => existingPrecedent.incident_id == precedent.incident_id
          )
        )
      )*/
      for (const precedent of result.precedents) {
        if (allPrecedents.every(p => {
          return p.incident_id != precedent.incident_id
        })) {
          allPrecedents.push(precedent);
        }
      }
    }
    setFieldValue('risks', values.risks.filter(risk => !risk.generated).concat(risksToAdd));
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
    alert("Problem");
  }

  setRisksLoading(false);
}
