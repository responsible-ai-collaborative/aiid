import styled from 'styled-components';

export const StyledHeading = styled('h1')`
  font-size: 32px;
  line-height: 1.5;
  font-weight: 500;
  flex: 1;
  margin-top: 0;
  padding-top: 0;
  color: ${(props) => props.theme.colors.heading};
`;

export const Author = styled.p`
  font-style: italic;
  padding: 1rem 0 2rem;
`;

export const StyledMainWrapper = styled.div`
  max-width: 750px;
  color: ${(props) => props.theme.colors.text};

  ul,
  ol {
    -webkit-padding-start: 40px;
    -moz-padding-start: 40px;
    -o-padding-start: 40px;
    padding: 0px 0px 0px 2em;

    li {
      font-size: 16px;
      line-height: 1.8;
      font-weight: 400;
    }
  }

  a {
    transition: color 0.15s;
    color: ${(props) => props.theme.colors.link};
  }

  code {
    border: 1px solid #ede7f3;
    border-radius: 4px;
    padding: 2px 6px;
    font-size: 0.9375em;

    background: ${(props) => props.theme.colors.background};
  }
`;
