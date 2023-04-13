import React, { useCallback } from 'react';
import { connectRefinementList, Highlight } from 'react-instantsearch-dom';
import useSearch from '../useSearch';
import { Trans, useTranslation } from 'react-i18next';
import { Badge, Button, ListGroup } from 'flowbite-react';
import { Form, Formik } from 'formik';
import FieldContainer from 'components/forms/SubmissionWizard/FieldContainer';
import Label from 'components/forms/Label';
import TextInputGroup from 'components/forms/TextInputGroup';

const RefinementList = ({
  items,
  isFromSearch,
  refine,
  searchForItems,
  placeholder,
  attribute,
}) => {
  const clear = useCallback(() => {
    refine([]);
  }, [items]);

  const { searchState } = useSearch();

  const selectedItems = searchState.refinementList[attribute] || [];

  const clearEnabled = selectedItems.length > 0;

  const { t } = useTranslation();

  return (
    <div>
      <Formik initialValues={{}} onSubmit={() => {}} enableReinitialize>
        {({ values, errors, touched, handleBlur, setValues }) => (
          <>
            <Form onSubmit={(e) => e.preventDefault()}>
              <FieldContainer>
                <Label>
                  <Trans>From Date</Trans>:
                </Label>
                <TextInputGroup
                  name="search"
                  label={'Search'}
                  placeholder={t(placeholder)}
                  schema={null}
                  icon={null}
                  type="search"
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleBlur={handleBlur}
                  handleChange={(event) => {
                    setValues({ search: event.currentTarget.value });
                    searchForItems(event.currentTarget.value);
                  }}
                />
              </FieldContainer>
            </Form>
          </>
        )}
      </Formik>
      <ListGroup className="max-h-[400px] overflow-y-auto mt-4 border">
        {items.map((item) => (
          <button
            className={`list-group-item text-left ${
              item.isRefined ? 'bg-green-200 active' : 'hover:bg-gray-200'
            } cursor-pointer p-3 flex justify-between items-center w-full`}
            key={item.label}
            data-cy={`${attribute}-item`}
            onClick={() => {
              refine(item.value);
            }}
          >
            {isFromSearch ? <Highlight attribute="label" hit={item} /> : item.label}&nbsp;
            <Badge color="gray">{item.count}</Badge>
          </button>
        ))}

        {items.length === 0 && (
          <div className="p-3 flex justify-center" key="no-results">
            <Trans>No result</Trans>
          </div>
        )}
      </ListGroup>
      <Button color="light" className="mt-4 no-underline" onClick={clear} disabled={!clearEnabled}>
        <Trans>Clear</Trans>
      </Button>
    </div>
  );
};

export const touchedCount = ({ searchState, attribute }) =>
  searchState.refinementList[attribute] ? searchState.refinementList[attribute].length : 0;

export default connectRefinementList(RefinementList);
