import React, { useRef, useState, useEffect } from 'react';

/**
 * @param {{ text: string, max: number }} props
 */
const ReadMoreText = ({ text, rows = 3, visibility }) => {
  if (!text) return null;

  const parentRef = useRef();

  const textRef = useRef();

  const [overflowing, setOverflowing] = useState(true);

  const [showMore, setShowMore] = useState(false);

  const toggleShowMore = () => !setShowMore(!showMore);

  const checkOverflow = () => {
    if (textRef.current.clientHeight > parentRef.current.clientHeight) {
      setOverflowing(true);
    } else {
      setOverflowing(false);
    }
  };

  useEffect(() => {
    checkOverflow();
    window.addEventListener('resize', checkOverflow);

    return () => {
      window.removeEventListener('resize', checkOverflow);
    };
  }, []);

  useEffect(() => {
    if (visibility) {
      setTimeout(checkOverflow, 300);
    }
  }, [visibility]);

  return (
    <>
      <div
        ref={parentRef}
        className={`${showMore ? 'overflow-visible' : 'overflow-hidden'}`}
        style={{ height: showMore ? 'auto' : `${rows * 1.5}rem` }}
      >
        <p className="leading-6 m-0" ref={textRef}>
          {text.split('\n').map((p, key) => (
            <span key={key}>
              {p}
              <br />
            </span>
          ))}
        </p>
      </div>
      {overflowing && (
        <div className="flex justify-end text-right px-4">
          <button className="text-blue-600 underline" onClick={toggleShowMore}>
            {showMore ? 'less' : 'read more'}
          </button>
        </div>
      )}
    </>
  );
};

export default ReadMoreText;
