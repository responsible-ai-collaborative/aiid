import React from 'react';
import { graphql } from 'gatsby';
import PostsListing from 'components/blog/PostsListing';
import AiidHelmet from 'components/AiidHelmet';

const BlogPage = (props) => {
  return (
    <>
      <AiidHelmet metaTitle={'AIID Blog'} path={props.location.pathname} />
      <div className={'titleWrapper'}>
        <h1>Blog</h1>
      </div>
      <div className="page">
        <PostsListing posts={props.data.posts.edges} mdxBlogPosts={props.data.mdxBlogPosts.nodes} />
      </div>
    </>
  );
};

export default BlogPage;

export const IndexQuery = graphql`
  query BlogPosts($locale: String!) {
    posts: allPrismicBlog(
      filter: { data: { language: { eq: $locale } } }
      sort: { data: { date: DESC } }
    ) {
      edges {
        node {
          uid
          lang
          data {
            metatitle
            metadescription
            slug
            aitranslated
            language
            title {
              text
            }
            content {
              richText
              text
              html
            }
            image {
              url
              gatsbyImageData
            }
            date
            author
          }
        }
      }
    }
    mdxBlogPosts: allMdx(
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
