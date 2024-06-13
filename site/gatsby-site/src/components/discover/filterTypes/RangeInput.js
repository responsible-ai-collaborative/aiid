import React, { useState, useRef, useEffect } from 'react';
import { useRange } from 'react-instantsearch';
import { Trans } from 'react-i18next';
import { debounce } from 'debounce';
import { Button, Checkbox } from 'flowbite-react';
import { Form, Formik } from 'formik';
import Label from 'components/forms/Label';
import TextInputGroup from 'components/forms/TextInputGroup';
import FieldContainer from 'components/forms/SubmissionWizard/FieldContainer';
import { useInstantSearch, useClearRefinements } from 'react-instantsearch';

const formatDate = (epoch) => new Date(epoch * 1000).toISOString().substr(0, 10);

const dateToEpoch = (date) => new Date(date).getTime() / 1000;

export default function RangeInput({ attribute, histogramBins }) {
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
                selectionMin={currentRefinement.min}
                selectionMax={currentRefinement.max}
                setSelection={debounce((min, max) => {
                  onChange({ min, max });
                }, 1000)}
                {...{ histogramBins }}
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
  selectionMin,
  selectionMax,
  setSelection,
  histogramBins,
}) => {
  const valueToProportion = (value) => globalMin + (globalMax - globalMin) * value;

  const [lowerBound, bareSetLowerBound] = useState(valueToProportion(selectionMin));

  const [upperBound, bareSetUpperBound] = useState(valueToProportion(selectionMax));

  const setLowerBound = (value) => {
    bareSetLowerBound(value);
    setSelection(valueToProportion(value), valueToProportion(upperBound));
  };

  const setUpperBound = (value) => {
    bareSetUpperBound(value);
    setSelection(valueToProportion(lowerBound), valueToProportion(value));
  };

  const binsMax = Math.max(...histogramBins);

  useEffect(() => {
    setUpperBound((selectionMax - globalMin) / (globalMax - globalMin));
  }, [selectionMax, globalMax, globalMin]);

  const [logScale, setLogScale] = useState(true);

  const numTicks = 20;

  return (
    <>
      <div className="mb-2">
        <Checkbox
          id="log-scale"
          checked={logScale ? true : undefined}
          onClick={() => setLogScale((logScale) => !logScale)}
          className="mr-1"
        />
        <label htmlFor="log-scale">Log Scale</label>
      </div>
      <div className="h-32 w-full bg-gray-100 relative">
        <div className="h-full w-full absolute inset-0">
          {Array(numTicks)
            .fill()
            .map((_, i) => {
              const proportion = logScale
                ? Math.log((i * binsMax) / numTicks) / Math.log(binsMax)
                : (i * binsMax) / numTicks / binsMax;

              return (
                <div
                  key={i}
                  className="w-full h-px bg-gray-200 absolute"
                  style={{ bottom: proportionToPercent(proportion) }}
                />
              );
            })}
        </div>
        <div className="flex items-end w-full h-full absolute inset-0">
          {histogramBins.map((bin, i) => {
            const rangeWidth = globalMax - globalMin;

            const dateRangeStart = globalMin + (i * rangeWidth) / histogramBins.length;

            const dateRangeEnd = globalMin + ((i + 1) * rangeWidth) / histogramBins.length;

            const baseProportion = bin / binsMax;

            const logProportion = Math.log(bin) / Math.log(binsMax);

            const proportion = logScale ? logProportion : baseProportion;

            return (
              <div
                key={i}
                title={`${bin} reports from ${formatDate(dateRangeStart)} to ${formatDate(
                  dateRangeEnd
                )}`}
                className={`border-1 border-white ${
                  (i + 1) / histogramBins.length >= lowerBound &&
                  i / histogramBins.length <= upperBound
                    ? 'bg-blue-500'
                    : 'bg-gray-700'
                }`}
                style={{
                  width: proportionToPercent(1 / histogramBins.length),
                  height: proportionToPercent(proportion),
                }}
              />
            );
          })}
        </div>
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
        data-cy="range-knob"
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
        data-cy="range-knob-handle"
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
