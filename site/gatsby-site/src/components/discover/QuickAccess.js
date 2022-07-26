import React from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';

const Wrapper = styled.div`
  background-color: #f8f8f8;
  font-family: Karla, sans-serif !important;
  font-weight: bold;
  color: #001934;
  display: flex;
  align-items: center;
  a {
    color: #001934;
  }
`;

const Circle = styled.div`
  width: 8px;
  height: 8px;
  background-color: var(--primary3);
  border-radius: 50%;
  margin: 0 12px;
`;

export default function DiscoverQuickAccess({ className }) {
  return (
    <Wrapper className={`${className} p-2 p-md-4`}>
      <Link to="/apps/discover" className="fs-5">
        {' '}
        Discover
      </Link>
      <Circle />
      <Link to="/apps/submit" className="fs-5">
        Submit
      </Link>
    </Wrapper>
  );
}
