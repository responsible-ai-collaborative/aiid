const path = require('path');

const createBlogPages = async (graphql, createPage, { languages, reporter }) => {
  const result = await graphql(
    `
      query BlogPosts {
        allPrismicBlog(sort: { data: { date: DESC } }) {
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
        mdxBlogPosts: allFile(
          filter: { sourceInstanceName: { in: ["blog"] }, ext: { eq: ".mdx" } }
        ) {
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

  const {
    allPrismicBlog: { edges: posts },
    mdxBlogPosts: { nodes: oldPosts },
  } = result.data;

  posts.forEach((post) => {
    let lang = languages[0];

    if (post.node.data.language) {
      lang = languages.find(
        (l) =>
          l.hrefLang.toLowerCase() === post.node.data.language.toLowerCase() ||
          l.hrefLang.toLowerCase() === post.node.data.language.toLowerCase().slice(0, 2)
      );
      if (!lang) {
        lang = languages[0];
      }
    }

    createPage({
      path: `/blog/${post.node.data.slug}`,
      component: path.resolve('./src/templates/blogPost.js'),
      context: {
        slug: post.node.data.slug,
      },
    });
  });

  oldPosts.forEach((node) => {
    if (node.childMdx.frontmatter.slug) {
      createPage({
        path: node.childMdx.frontmatter.slug,
        component: `${path.resolve(`./src/templates/post.js`)}?__contentFilePath=${
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

module.exports = createBlogPages;
