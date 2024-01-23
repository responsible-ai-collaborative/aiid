import React from 'react';
import { graphql } from 'gatsby';
import PrismicDocPost from 'components/doc/PrismicDocPost';
import AiidHead from 'components/AiidHead';

export default function PrismicDoc(props) {
  const doc = props?.data?.doc;

  return (
    <>
      <PrismicDocPost doc={doc} location={props.location} />
    </>
  );
}

export const Head = (props) => {
  const {
    location: { pathname },
  } = props;

  const doc = props?.data?.doc;

  const metaTitle = doc?.data?.metaTitle;

  const metaDescription = doc?.data?.metaDescription;

  return <AiidHead path={pathname} {...{ metaTitle, metaDescription }} />;
};

export const pageQuery = graphql`
  query Doc($slug: String!, $locale: String!) {
    site {
      siteMetadata {
        title
        docsLocation
      }
    }
    doc: prismicDoc(data: { language: { eq: $locale }, slug: { eq: $slug } }) {
      data {
        title
        metatitle
        metadescription
        aitranslated
        language
        slug
        content {
          text {
            richText
          }
          markdown {
            richText
          }
          component
        }
      }
    }
  }
`;
