import { Typeahead } from 'react-bootstrap-typeahead';
import styled from 'styled-components';

export default styled(Typeahead)`
  .rbt-input-multi .rbt-input-wrapper {
    background-color: rgb(249 250 251 / 1) !important;
    padding-left: 0.625rem !important;
    align-items: center;
  }

  .rbt-close {
    border: none;
    background: transparent;
  }

  .rbt-input-multi {
    padding: 0 !important;
  }

  input {
    font-size: 0.875rem !important;
    line-height: 1.25rem !important;
    background-color: rgb(249 250 251 / 1) !important;
    padding: 0.625rem 0.625rem 0.625rem 0 !important;
    border-color: rgb(209 213 219 / 1) !important;
    border-width: 1px !important;
  }
`;
