import React, { useRef, useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';

const Container = styled.div`
  height: ${(props) => (props.showMore ? 'auto' : `${props.rows * 1.5}rem`)};
  overflow: ${(props) => (props.showMore ? 'visible' : 'hidden')};
`;

const Text = styled.p`
  line-height: 1.5rem;
  margin: 0;
`;

const Toggle = styled(Button).attrs({
  variant: 'link',
})`
  &&& {
    padding: 0;

    &:focus {
      outline: none;
      box-shadow: none;
    }
  }
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
    <div className="bootstrap">
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
        <div className="text-right px-4">
          <Toggle onClick={toggleShowMore}>{showMore ? 'less' : 'read more'}</Toggle>
        </div>
      )}
    </div>
  );
};

export default ReadMoreText;
