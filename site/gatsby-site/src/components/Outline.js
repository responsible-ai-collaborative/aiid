import React from 'react';
import { StaticQuery, graphql } from 'gatsby';

import config from '../../config';

import { useLocalization } from 'plugins/gatsby-theme-i18n';

const SidebarLayout = ({ location }) => {
  const { locale } = useLocalization();

  return (
    <StaticQuery
      query={graphql`
        query {
          allMdx {
            edges {
              node {
                fields {
                  slug
                }
                tableOfContents
              }
            }
          }
        }
      `}
      render={({ allMdx }) => {
        let navItems;

        if (allMdx.edges && allMdx.edges.length > 0) {
          const indexName = (
            location.pathname.replace(`/${locale}`, '') +
            '/index' +
            (locale == 'en' ? '' : `.${locale}`)
          ).replace(/\/+/g, '/');

          const matchingPage = allMdx.edges.find((page) => {
            const slug = page?.node?.fields?.slug;

            const prefixedSlug = slug && config.gatsby.pathPrefix + slug;

            return [slug, prefixedSlug].includes(indexName) && page.node.tableOfContents?.items;
          });

          navItems =
            matchingPage?.node &&
            matchingPage.node.tableOfContents.items.map((item, index) => {
              const itemId = item.title ? item.title.replace(/\s+/g, '').toLowerCase() : '#';

              return (
                <li key={index} className={'list-none'}>
                  <a
                    key={index}
                    href={`#${itemId}`}
                    className={`text-[#5c6975] no-underline font-normal py-2 pr-0 block relative hover:text-blue-500`}
                  >
                    {item.title}
                  </a>
                </li>
              );
            });
        }
        return (
          <aside className="sidebar right">
            <ul data-cy="outline" className={'rightSideBarUL list-revert pl-8'}>
              {navItems && navItems.length > 0 && (
                <>
                  <li className={'rightSideTitle'}>CONTENTS</li>
                  {navItems}
                </>
              )}
            </ul>
          </aside>
        );
      }}
    />
  );
};

export default SidebarLayout;
