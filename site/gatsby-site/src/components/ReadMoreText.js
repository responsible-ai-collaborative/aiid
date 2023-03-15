import { Button } from 'flowbite-react';
import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  height: ${(props) => (props.showMore ? 'auto' : `${props.rows * 1.5}rem`)};
  overflow: ${(props) => (props.showMore ? 'visible' : 'hidden')};
`;

const Text = styled.p`
  line-height: 1.5rem;
  margin: 0;
`;

/**
 * @param {{ text: string, max: number }} props
 */
const ReadMoreText = ({ text, rows = 3, visibility, ...props }) => {
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
      <Container ref={parentRef} showMore={showMore} rows={rows} {...props}>
        <Text ref={textRef}>
          {text.split('\n').map((p, key) => (
            <span key={key}>
              {p}
              <br />
            </span>
          ))}
        </Text>
      </Container>
      {overflowing && (
        <div className="flex justify-end text-right px-4">
          <Button onClick={toggleShowMore}>{showMore ? 'less' : 'read more'}</Button>
        </div>
      )}
    </>
  );
};

export default ReadMoreText;
