import { Pagination } from 'react-instantsearch-dom';
import styled from 'styled-components';

const StyledPagination = styled(Pagination)`
  padding: 50px 0 50px 0;

  .ais-Pagination {
    color: #3a4570;
  }

  .ais-Pagination-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
  }

  .ais-Pagination-item + .ais-Pagination-item {
    margin-left: 0.3rem;
  }

  .ais-Pagination-link {
    color: #0096db;
    -webkit-transition: color 0.2s ease-out;
    transition: color 0.2s ease-out;
    padding: 0.3rem 0.6rem;
    display: block;
    border: 1px solid #c4c8d8;
    border-radius: 5px;
    -webkit-transition: background-color 0.2s ease-out;
    transition: background-color 0.2s ease-out;

    :hover {
      color: #0073a8;
      background-color: #e3e5ec;
    }

    :focus {
      color: #0073a8;
      background-color: #e3e5ec;
    }
  }

  .ais-Pagination-item--disabled .ais-Pagination-link {
    opacity: 0.6;
    cursor: not-allowed;
    color: #a5abc4;

    :hover {
      color: #a5abc4;
      background-color: #fff;
    }

    :focus {
      color: #a5abc4;
      background-color: #fff;
    }
  }

  .ais-Pagination-item--selected .ais-Pagination-link {
    color: #fff;
    background-color: #0096db;
    border-color: #0096db;

    :hover {
      color: #fff;
    }

    :focus {
      color: #fff;
    }
  }
`;

export default StyledPagination;
