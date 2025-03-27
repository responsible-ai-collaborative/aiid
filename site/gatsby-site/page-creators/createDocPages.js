const path = require('path');

const createPrismicDocPages = async (graphql, createPage, { reporter }) => {
  const result = await graphql(
    `
      {
        allPrismicDoc {
          edges {
            node {
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
        }
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

  const usedSlugs = [];

  if (result.data.allPrismicDoc.edges.length > 0) {
    result.data.allPrismicDoc.edges.forEach((node) => {
      if (node?.node?.data?.slug) {
        usedSlugs.push(node?.node?.data?.slug);
        createPage({
          path: node?.node?.data.slug,
          component: `${path.resolve(`./src/templates/prismicDoc.js`)}`,
          context: {
            slug: node?.node?.data.slug,
          },
        });
      } else {
        reporter.warn(`Missing slug for ${node?.node?.data?.title}`);
      }
    });
  }

  if (result.data.allFile.nodes.length > 0) {
    result.data.allFile.nodes.forEach((node) => {
      if (node.childMdx.frontmatter.slug) {
        if (!usedSlugs.includes(node.childMdx.frontmatter.slug)) {
          createPage({
            path: node.childMdx.frontmatter.slug,
            component: `${path.resolve(`./src/templates/doc.js`)}?__contentFilePath=${
              node.childMdx.internal.contentFilePath
            }`,
            context: {
              slug: node.childMdx.frontmatter.slug,
            },
          });
        }
      } else {
        reporter.warn(`Missing slug for ${node.absolutePath}`);
      }
    });
  }
};

module.exports = createPrismicDocPages;
