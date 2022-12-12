import React from 'react';

export default function Pagination(props) {
  return (
    <>
      <ul {...props} className={`tw-pagination ${props.className || ''}`}>
        {props.children}
      </ul>
    </>
  );
}

Pagination.Item = function PaginationItem(props) {
  return (
    <li className={`tw-page-item ${props.className || ''} ${props.disabled ? 'disabled' : ''}`}>
      {props.href ? (
        <a className={`tw-page-link`} href={props.href}>
          {props.children}
        </a>
      ) : (
        <span className="tw-page-link">{props.children}</span>
      )}
    </li>
  );
};
