import React from 'react';
import { graphql } from 'gatsby';
import PrismicDocPost from 'components/doc/PrismicDocPost';

export default function PrismicDoc(props) {
  let doc = props?.data?.doc;

  const enDoc = props?.data?.enDoc;

  // If the doc is not translated, use the English version
  if (!doc) doc = enDoc;

  return (
    <>
      <PrismicDocPost doc={doc} location={props.location} />
    </>
  );
}

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
    enDoc: prismicDoc(data: { language: { eq: "en" }, slug: { eq: $slug } }) {
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
