import React from 'react';
import { StaticQuery, graphql } from 'gatsby';

import config from '../../config';
import { Sidebar, ListItem } from './styles/Sidebar';

import { useLocalization } from 'gatsby-theme-i18n';

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
        let finalNavItems;

        if (allMdx.edges !== undefined && allMdx.edges.length > 0) {
          allMdx.edges.map((item) => {
            let innerItems;

            if (item !== undefined) {
              const indexName = (
                location.pathname.replace(`/${locale}`, '') +
                '/index' +
                (locale == 'en' ? '' : `.${locale}`)
              ).replace(/\/+/g, '/');

              if (
                [item.node.fields.slug, config.gatsby.pathPrefix + item.node.fields.slug].includes(
                  indexName
                )
              ) {
                if (item.node.tableOfContents.items) {
                  innerItems = item.node.tableOfContents.items.map((innerItem, index) => {
                    const itemId = innerItem.title
                      ? innerItem.title.replace(/\s+/g, '').toLowerCase()
                      : '#';

                    return (
                      <ListItem key={index} to={`#${itemId}`} level={1}>
                        {innerItem.title}
                      </ListItem>
                    );
                  });
                }
              }
            }
            if (innerItems) {
              finalNavItems = innerItems;
            }
          });
        }

        if (finalNavItems && finalNavItems.length) {
          return (
            <Sidebar>
              <ul data-cy="outline" className={'rightSideBarUL'}>
                <li className={'rightSideTitle'}>CONTENTS</li>
                {finalNavItems}
              </ul>
            </Sidebar>
          );
        } else {
          return (
            <Sidebar>
              <ul></ul>
            </Sidebar>
          );
        }
      }}
    />
  );
};

export default SidebarLayout;
