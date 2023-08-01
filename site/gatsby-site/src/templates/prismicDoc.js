import React from 'react';
import { graphql } from 'gatsby';
import PrismicDocPost from 'components/doc/PrismicDocPost';

export default function PrismicDoc(props) {
  const doc = props?.data?.doc;

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
          component
        }
      }
    }
  }
`;
