const path = require('path');

const createMdxPages = async (graphql, createPage, { reporter }) => {
  const result = await graphql(
    `
      {
        allFile(filter: { sourceInstanceName: { in: ["docs"] }, ext: { eq: ".mdx" } }) {
          nodes {
            sourceInstanceName
            absolutePath
            childMdx {
              frontmatter {
                slug
              }
              internal {
                contentFilePath
              }
            }
          }
        }
      }
    `
  );

  result.data.allFile.nodes.forEach((node) => {
    if (node.childMdx.frontmatter.slug) {
      const template = node.sourceInstanceName == 'blog' ? 'post' : 'doc';

      createPage({
        path: node.childMdx.frontmatter.slug,
        component: `${path.resolve(`./src/templates/${template}.js`)}?__contentFilePath=${
          node.childMdx.internal.contentFilePath
        }`,
        context: {
          slug: node.childMdx.frontmatter.slug,
        },
      });
    } else {
      reporter.warn(`Missing slug for ${node.absolutePath}`);
    }
  });
};

module.exports = createMdxPages;
