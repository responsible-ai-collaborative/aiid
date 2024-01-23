import React, { useEffect } from 'react';
import AiidHead from 'components/AiidHead';
import { graphql, Link } from 'gatsby';
import { MDXProvider } from '@mdx-js/react';
import Components from 'components/ui/MdxComponents';
import TranslationBadge from 'components/i18n/TranslationBadge';
import { Trans } from 'react-i18next';
import Outline from 'components/Outline';
import { useLayoutContext } from 'contexts/LayoutContext';

export default function Doc(props) {
  const {
    data: { mdx },
    children,
  } = props;

  const rightSidebar = (
    <>
      <Outline location={props.location} />
    </>
  );

  const { displayRightSidebar } = useLayoutContext();

  useEffect(() => {
    displayRightSidebar(rightSidebar);
  }, []);

  return (
    <>
      <div className={'titleWrapper'}>
        <h1>{mdx.fields.title}</h1>
        {mdx.frontmatter.aiTranslated && (
          <div>
            <TranslationBadge className="d-inline-block" />
            <Link className="d-inline-block ml-2" to={mdx.frontmatter.slug}>
              <Trans>View Original</Trans>
            </Link>
          </div>
        )}
      </div>
      <div className="styled-main-wrapper prose">
        <MDXProvider components={Components}>{children}</MDXProvider>
      </div>
    </>
  );
}

export const Head = (props) => {
  const {
    location: { pathname },
    data: { mdx },
  } = props;

  const metaTitle = mdx.frontmatter.metaTitle;

  const metaDescription = mdx.frontmatter.metaDescription;

  return <AiidHead path={pathname} {...{ metaTitle, metaDescription }} />;
};

export const pageQuery = graphql`
  query DocsTemplateQuery($slug: String!, $locale: String!) {
    site {
      siteMetadata {
        title
        docsLocation
      }
    }
    mdx(fields: { locale: { eq: $locale } }, frontmatter: { slug: { eq: $slug } }) {
      fields {
        id
        title
        slug
      }
      tableOfContents
      parent {
        ... on File {
          relativePath
        }
      }
      frontmatter {
        metaTitle
        metaDescription
        aiTranslated
        slug
      }
    }
  }
`;
