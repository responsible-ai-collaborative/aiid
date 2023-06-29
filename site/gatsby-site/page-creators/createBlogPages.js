const path = require('path');

const createBlogPages = async (graphql, createPage, { languages }) => {
  console.log(languages);
  const result = await graphql(
    `
      query BlogPosts {
        allPrismicBlog {
          edges {
            node {
              id
              url
              uid
              data {
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
    console.log(post);
    createPage({
      path: `/blog-post/${post.node.uid}`,
      component: path.resolve('./src/templates/blogPost.js'),
      context: {
        uid: post.node.uid,
      },
    });
  });
};

module.exports = createBlogPages;
