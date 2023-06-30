const path = require('path');

const createBlogPages = async (graphql, createPage, { languages }) => {
  const result = await graphql(
    `
      query BlogPosts {
        allPrismicBlog {
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
      }
    `
  );

  const {
    allPrismicBlog: { edges: posts },
  } = result.data;

  posts.forEach((post) => {
    const lang = languages.find(
      (l) =>
        l.hrefLang.toLowerCase() === post.node.data.language.toLowerCase() ||
        l.hrefLang.toLowerCase() === post.node.data.language.toLowerCase().slice(0, 2)
    );

    createPage({
      path:
        post.node.lang === 'en-us' && lang?.code
          ? `/blog-post/${post.node.data.slug}`
          : `/${lang.code}/blog-post/${post.node.data.slug}`,
      component: path.resolve('./src/templates/blogPost.js'),
      context: {
        uid: post.node.uid,
        slug: post.node.data.slug,
      },
    });
  });
};

module.exports = createBlogPages;
