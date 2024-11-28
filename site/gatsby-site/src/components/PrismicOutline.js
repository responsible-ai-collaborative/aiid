import React from 'react';

const PrismicSidebarLayout = ({ tableOfContents }) => {
  let navItems;

  if (tableOfContents.length > 0) {
    navItems = tableOfContents.map((item) => {
      return (
        <li key={item.id} className="list-none">
          <a
            href={`#${item.id}`}
            className="text-[#5c6975] no-underline font-normal py-2 pr-0 block relative hover:text-blue-500"
          >
            {item.title}
          </a>
        </li>
      );
    });
  }

  return (
    <aside className="sidebar right">
      <ul data-cy="outline" className="rightSideBarUL list-revert pl-8">
        {navItems?.length > 0 && (
          <>
            <li className="rightSideTitle">CONTENTS</li>
            {navItems}
          </>
        )}
      </ul>
    </aside>
  );
};

export default PrismicSidebarLayout;
