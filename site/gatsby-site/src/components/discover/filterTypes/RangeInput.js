import React from 'react';
import { connectRange } from 'react-instantsearch-dom';
import useSearch from '../useSearch';
import { Trans } from 'react-i18next';
import { debounce } from 'debounce';
import { Button } from 'flowbite-react';
import { Form, Formik } from 'formik';
import Label from 'components/forms/Label';
import TextInputGroup from 'components/forms/TextInputGroup';
import FieldContainer from 'components/forms/SubmissionWizard/FieldContainer';

const formatDate = (epoch) => new Date(epoch * 1000).toISOString().substr(0, 10);

const dateToEpoch = (date) => new Date(date).getTime() / 1000;

const RangeInput = ({ min, max, currentRefinement, refine, attribute }) => {
  if ((!min && min !== 0) || (!max && max !== 0)) {
    return null;
  }

  const onChange = ({ min, max }) => {
    if (currentRefinement.min !== min || currentRefinement.max !== max) {
      refine({ min, max });
    }
  };

  const clear = () => {
    refine({});
  };

  const { searchState } = useSearch();

  const touchedMin = searchState.range[attribute] && searchState.range[attribute].min;

  const touchedMax = searchState.range[attribute] && searchState.range[attribute].max;

  const clearEnabled = touchedMin || touchedMax;

  return (
    <div>
      <Formik initialValues={{}} onSubmit={() => {}} enableReinitialize>
        {({ values, errors, touched, handleBlur }) => (
          <>
            <Form className="px-3">
              <FieldContainer>
                <Label>
                  <Trans>From Date</Trans>:
                </Label>
                <TextInputGroup
                  name="from_date"
                  label={'From Date'}
                  placeholder={'From Date'}
                  schema={null}
                  icon={null}
                  type="date"
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleBlur={handleBlur}
                  min={formatDate(min)}
                  max={formatDate(
                    currentRefinement.min > currentRefinement.max
                      ? max
                      : Math.min(max, currentRefinement.max)
                  )}
                  defaultValue={formatDate(currentRefinement.min)}
                  handleChange={(event) => {
                    const newMin = dateToEpoch(event.target.value);

                    if (newMin >= min || currentRefinement.min != min) {
                      debounce(() =>
                        onChange({ min: Math.max(min, newMin), max: currentRefinement.max })
                      )();
                    }
                  }}
                />
              </FieldContainer>
              <FieldContainer>
                <Label>
                  <Trans>To Date</Trans>:
                </Label>
                <TextInputGroup
                  name="to_date"
                  label={'To Date'}
                  placeholder={'To Date'}
                  schema={null}
                  icon={null}
                  type="date"
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleBlur={handleBlur}
                  min={formatDate(
                    currentRefinement.min > currentRefinement.max
                      ? min
                      : Math.max(min, currentRefinement.min)
                  )}
                  max={formatDate(new Date().valueOf())}
                  defaultValue={formatDate(currentRefinement.max)}
                  handleChange={(event) => {
                    const newMax = dateToEpoch(event.target.value);

                    if (newMax <= max || currentRefinement.max != max) {
                      debounce(() =>
                        onChange({ min: currentRefinement.min, max: Math.min(max, newMax) })
                      )();
                    }
                  }}
                />
              </FieldContainer>
              <Button
                color="light"
                className="mt-4 no-underline"
                onClick={clear}
                disabled={!clearEnabled}
              >
                <Trans>Clear</Trans>
              </Button>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
};

export const touchedCount = ({ searchState, attribute }) =>
  searchState.range[attribute] &&
  (searchState.range[attribute].min || searchState.range[attribute].max)
    ? 1
    : 0;

export default connectRange(RangeInput);
