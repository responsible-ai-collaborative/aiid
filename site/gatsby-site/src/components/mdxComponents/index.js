import React from 'react';
import styled from '@emotion/styled';

import CodeBlock from './codeBlock';
import AnchorTag from './anchor';

const StyledPre = styled('pre')`
  padding: 16px;
  background: ${(props) => props.theme.colors.preFormattedText};
`;

const h1 = ({ children, ...props }) => (
  <h1 className="heading1" id={children.replace(/\s+/g, '').toLowerCase()} {...props}>
    {children}
  </h1>
);

const h2 = ({ children, ...props }) => (
  <h2 className="heading2" id={children.replace(/\s+/g, '').toLowerCase()} {...props}>
    {children}
  </h2>
);

const h3 = ({ children, ...props }) => (
  <h3 className="heading3" id={children.replace(/\s+/g, '').toLowerCase()} {...props}>
    {children}
  </h3>
);

const h4 = ({ children, ...props }) => (
  <h4 className="heading4" id={children.replace(/\s+/g, '').toLowerCase()} {...props}>
    {children}
  </h4>
);

const h5 = ({ children, ...props }) => (
  <h5 className="heading5" id={children.replace(/\s+/g, '').toLowerCase()} {...props}>
    {children}
  </h5>
);

const h6 = ({ children, ...props }) => (
  <h6 className="heading6" id={children.replace(/\s+/g, '').toLowerCase()} {...props}>
    {children}
  </h6>
);

const p = (props) => <p className="paragraph" {...props} />;

const pre = (props) => (
  <StyledPre>
    <pre {...props} />
  </StyledPre>
);

export default {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  pre,
  code: CodeBlock,
  a: AnchorTag,
  // TODO add `img`
  // TODO add `blockquote`
  // TODO add `ul`
  // TODO add `li`
  // TODO add `table`
};
