import React, { useEffect } from 'react';
import { Form } from 'formik';
import { Button, Select, TextInput, Textarea, Card } from 'flowbite-react';
import { Trans } from 'react-i18next';

import { classyDiv } from 'utils/classy';
import { Label, abbreviatedTag } from 'utils/checklists';
import Tags from 'components/forms/Tags';

export default function CheckListForm({ 
  values, handleChange, handleSubmit, setFieldTouched, 
  setFieldValue, isSubmitting, submitForm, tags, t 
}) {

  useEffect(() => {
    searchRisks({ values, setFieldValue });
    return () => {}
  }, [values['tags-goals'], values['tags-methods'], values['tags-other']])

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
              id: 'tags-goals', 
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
              id: 'tags-methods', 
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
            id: 'tags-other', 
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
        <p><Trans>Risks are surface automatically based on the tags applied to the system. They can also be added manually. Each risk is associated with a query for precedent incidents, which can be modified to suit your needs. You can subscribe both to new risks and new precedent incidents.</Trans></p>

        <div className="flex flex-col gap-6">
          {(values.risks || []).map((risk) => (
            <RiskSection {...{ risk, values, setFieldValue, submitForm, tags }}/>
          ))}
        </div>
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
