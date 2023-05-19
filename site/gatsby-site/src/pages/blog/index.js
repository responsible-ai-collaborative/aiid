import { graphql } from 'gatsby';
import React, { useEffect } from 'react';
import PostsListing from 'components/blog/PostsListing';
import AiidHelmet from 'components/AiidHelmet';
import { useMenuContext } from 'contexts/MenuContext';

export default function BlogPage(props) {
  const {
    allMdx: { nodes: posts },
  } = props.data;

  const { isCollapsed, collapseMenu } = useMenuContext();

  useEffect(() => {
    if (isCollapsed) {
      collapseMenu(false);
    }
  }, []);

  return (
    <>
      <AiidHelmet metaTitle={'AIID Blog'} path={props.location.pathname} />
      <div className={'titleWrapper'}>
        <h1>Blog</h1>
      </div>
      <div>
        <PostsListing posts={posts} />
      </div>
    </>
  );
}

export const query = graphql`
  query BlogQuery($locale: String) {
    allMdx(
      filter: { fields: { slug: { glob: "/blog/**" }, locale: { eq: $locale } } }
      sort: { frontmatter: { date: DESC } }
    ) {
      nodes {
        fields {
          slug
          title
        }
        excerpt
        frontmatter {
          date
          author
          slug
          image {
            childImageSharp {
              gatsbyImageData(layout: FIXED)
            }
          }
        }
      }
    }
  }
`;
