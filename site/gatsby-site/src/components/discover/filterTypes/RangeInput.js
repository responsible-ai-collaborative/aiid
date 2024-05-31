import React, { useState, useRef, useEffect } from 'react';
import { useRange } from 'react-instantsearch';
import { Trans } from 'react-i18next';
import { debounce } from 'debounce';
import { Button } from 'flowbite-react';
import { Form, Formik } from 'formik';
import Label from 'components/forms/Label';
import TextInputGroup from 'components/forms/TextInputGroup';
import FieldContainer from 'components/forms/SubmissionWizard/FieldContainer';
import { useInstantSearch, useClearRefinements } from 'react-instantsearch';

const formatDate = (epoch) => new Date(epoch * 1000).toISOString().substr(0, 10);

const dateToEpoch = (date) => new Date(date).getTime() / 1000;

export default function RangeInput({ attribute, bins }) {
  const {
    range: { min, max },
    start,
    refine,
  } = useRange({ attribute });

  if ((!min && min !== 0) || (!max && max !== 0)) {
    return null;
  }

  const [minStart, maxStart] = start;

  const currentRefinement = {
    min: minStart < min ? min : minStart,
    max: maxStart > max ? max : maxStart,
  };

  const onChange = ({ min, max }) => {
    if (currentRefinement.min !== min || currentRefinement.max !== max) {
      refine([min, max]);
    }
  };

  const { refine: clear } = useClearRefinements({ includedAttributes: [attribute] });

  const { indexUiState } = useInstantSearch();

  const touchedMin = indexUiState?.range?.[attribute]?.split(':')[0];

  const touchedMax = indexUiState?.range?.[attribute]?.split(':')[1];

  const clearEnabled = touchedMin || touchedMax;

  return (
    <div>
      <Formik initialValues={{}} onSubmit={() => {}} enableReinitialize>
        {({ values, errors, touched, handleBlur }) => (
          <>
            <Form className="px-3">
              <DoubleRangeSlider
                globalMin={min}
                globalMax={max}
                selectionMax={currentRefinement.max}
                setSelectionMin={debounce((min) => {
                  onChange({ min, max: currentRefinement.max });
                })}
                setSelectionMax={debounce((max) => {
                  onChange({ max, min: currentRefinement.min });
                }, 2000)}
                {...{ bins }}
              />
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
}

const proportionToPercent = (proportion) => 100 * proportion + '%';

const sliderHeight = '1rem';

const DoubleRangeSlider = ({
  globalMin,
  globalMax,
  selectionMax,
  setSelectionMin,
  setSelectionMax,
  bins,
}) => {
  const [lowerBound, bareSetLowerBound] = useState();

  const setLowerBound = (value) => {
    bareSetLowerBound(value);
    setSelectionMin(globalMin + (globalMax - globalMin) * value);
  };

  const [upperBound, bareSetUpperBound] = useState();

  const setUpperBound = (value) => {
    bareSetUpperBound(value);
    setSelectionMax(globalMin + (globalMax - globalMin) * value);
  };

  const binsMax = Math.max(...bins);

  useEffect(() => {
    setUpperBound((selectionMax - globalMin) / (globalMax - globalMin));
  }, [selectionMax, globalMax, globalMin]);

  return (
    <>
      <div className="h-32 w-full bg-gray-100 relative flex items-end">
        {bins.map((bin, i) => (
          <div
            key={i}
            className={`border-1 border-white ${
              (i + 1) / bins.length >= lowerBound && i / bins.length <= upperBound
                ? 'bg-blue-500'
                : 'bg-gray-700'
            }`}
            style={{
              width: proportionToPercent(1 / bins.length),
              height: proportionToPercent(Math.log(bin) / Math.log(binsMax * 0.9)),
            }}
          />
        ))}
      </div>
      <div className="relative bg-gray-200" style={{ height: sliderHeight }}>
        <div
          className="bg-blue-600 h-full absolute"
          style={{
            left: `calc(${proportionToPercent(lowerBound)})`,
            width: proportionToPercent(upperBound - lowerBound),
          }}
        />

        <SliderKnob bound={lowerBound} setBound={setLowerBound} ceiling={upperBound} />
        <SliderKnob bound={upperBound} setBound={setUpperBound} floor={lowerBound} />
      </div>
    </>
  );
};

const SliderKnob = ({ bound, setBound, ceiling = 1, floor = 0 }) => {
  const [dragOffset, setDragOffset] = useState(null);

  const [handlePosition, setHandlePosition] = useState({
    top: '0px',
    left: proportionToPercent(bound),
  });

  const knobRef = useRef();

  useEffect(() => {
    if (dragOffset) {
      knobRef.current.focus();
    }
  });

  useEffect(() => {
    setHandlePosition({
      top: '0px',
      left: proportionToPercent(bound),
    });
  }, [bound]);

  const updatePosition = (event) => {
    if (dragOffset) {
      const parentClientRect = event.target.parentNode.getBoundingClientRect();

      const handleLeftPx = event.clientX - parentClientRect.x - dragOffset.x;

      setHandlePosition({
        top: event.clientY - parentClientRect.y - dragOffset.y + 'px',
        left: handleLeftPx + 'px',
      });

      const handleLeftPercent = handleLeftPx / parentClientRect.width;

      const newBound = clamp(handleLeftPercent, { floor, ceiling });

      setBound(newBound);

      return newBound;
    }
  };

  return (
    <>
      <button
        ref={knobRef}
        className="rounded-full bg-white absolute focus:border-2 border-blue-500"
        style={{
          height: sliderHeight,
          width: sliderHeight,
          left: `calc(${proportionToPercent(bound)} - calc(${sliderHeight} / 2))`,
        }}
        onKeyDown={(event) => {
          if (event.key == 'ArrowLeft') {
            const newBound = clamp(bound - 0.1, { floor, ceiling });

            setBound(newBound);
            setDragOffset(null);
            setHandlePosition({
              top: '0px',
              left: proportionToPercent(newBound),
            });
          }
          if (event.key == 'ArrowRight') {
            const newBound = clamp(bound + 0.1, { floor, ceiling });

            setBound(newBound);
            setDragOffset(null);
            setHandlePosition({
              top: '0px',
              left: proportionToPercent(newBound),
            });
          }
        }}
      />

      {/* This "handle" element moves with the cursor
       * so that we track the mouse position
       * while the knob is being dragged.
       * Then we move the knob to match the handle in the x-axis.
       */}
      <button
        tabIndex="-1"
        className="rounded-full absolute x-10"
        onClick={() => {
          knobRef.current.focus();
        }}
        onMouseDown={(event) => {
          const clientRect = event.target.getBoundingClientRect();

          const offset = { x: event.clientX - clientRect.x, y: event.clientY - clientRect.y };

          setDragOffset(offset);
        }}
        onMouseUp={() => {
          setDragOffset(null);
          setHandlePosition({
            // TODO: It would be more efficient to use translate()
            // so as to trigger fewer re-layouts.
            top: '0px',
            left: proportionToPercent(bound),
          });
        }}
        onMouseMove={(event) => {
          updatePosition(event);
        }}
        style={{
          height: sliderHeight,
          width: sliderHeight,
          ...handlePosition,
          ...(dragOffset
            ? // We enlarge the handle during movement
              // so that moving the cursor real fast doesn't take it outside the div
              // before an update occurs.
              { scale: '100', transformOrigin: 'center' }
            : { left: `calc(${handlePosition.left} - calc(${sliderHeight} / 2))` }),
        }}
      />
    </>
  );
};

const clamp = (value, { floor, ceiling }) => Math.max(Math.min(value, ceiling), floor);

export const touchedCount = ({ searchState, attribute }) =>
  searchState?.range?.[attribute]?.split(':')[0] || searchState?.range?.[attribute]?.split(':')[1]
    ? 1
    : 0;
