const path = require('path');

const createBlogPages = async (graphql, createPage, { languages, reporter }) => {
  const result = await graphql(
    `
      query BlogPosts {
        allPrismicBlog(sort: { data: { date: DESC } }) {
          nodes {
            uid
            data {
              aitranslated
              author
              content {
                text
                html
                richText
              }
              date
              image {
                url
                gatsbyImageData
              }
              language
              metadescription
              metatitle
              slug
              title {
                text
                html
                richText
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
    allPrismicBlog: { nodes: posts },
    mdxBlogPosts: { nodes: oldPosts },
  } = result.data;

  posts.forEach((post) => {
    let lang = languages[0];

    if (post.data.language) {
      lang = languages.find(
        (l) =>
          l.hrefLang.toLowerCase() === post.data.language.toLowerCase() ||
          l.hrefLang.toLowerCase() === post.data.language.toLowerCase().slice(0, 2)
      );
      if (!lang) {
        lang = languages[0];
      }
    }

    createPage({
      path: `/blog/${post.data.slug}`,
      component: path.resolve('./src/templates/prismicBlogPost.js'),
      context: {
        slug: post.data.slug,
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
