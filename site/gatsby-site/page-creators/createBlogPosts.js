const path = require('path');

const createBlogPosts = async (graphql, createPage) => {
  const result = await graphql(
    `
      {
        allMdx(filter: { fileAbsolutePath: { glob: "**/blog/*" } }) {
          edges {
            node {
              fields {
                id
              }
              tableOfContents
              fields {
                slug
              }
            }
          }
        }
      }
    `
  );

  result.data.allMdx.edges.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve('./src/templates/post.js'),
      context: {
        id: node.fields.id,
      },
    });
  });
};

module.exports = createBlogPosts;
