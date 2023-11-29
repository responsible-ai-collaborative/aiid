import createDocPages from '../../../../page-creators/createDocPages';

const response = {
  data: {
    allPrismicDoc: {
      edges: [
        {
          node: {
            data: {
              slug: 'doc-1-prismic',
            },
          },
        },
        {
          node: {
            data: {
              slug: 'doc-2-prismic',
            },
          },
        },
      ],
    },
    allFile: {
      nodes: [
        {
          childMdx: {
            frontmatter: {
              slug: 'doc-1',
            },
            internal: {
              contentFilePath: 'doc-1.mdx',
            },
          },
        },
        {
          childMdx: {
            frontmatter: {
              slug: 'doc-2',
            },
            internal: {
              contentFilePath: 'doc-2.mdx',
            },
          },
        },
      ],
    },
  },
};

describe('createDocPages', () => {
  it('Should parse properly', () => {
    const graphql = cy.stub().resolves(response);

    const createPage = cy.stub();

    const reporter = { log: cy.stub() };

    cy.wrap(createDocPages(graphql, createPage, { reporter })).then(() => {
      expect(createPage.callCount).to.eq(4);

      cy.wrap(createPage.getCall(0).args[0]).then((page) => {
        expect(page.context.slug).eq('doc-1-prismic');
      });

      cy.wrap(createPage.getCall(1).args[0]).then((page) => {
        expect(page.context.slug).eq('doc-2-prismic');
      });

      cy.wrap(createPage.getCall(2).args[0]).then((page) => {
        expect(page.context.slug).eq('doc-1');
      });

      cy.wrap(createPage.getCall(3).args[0]).then((page) => {
        expect(page.context.slug).eq('doc-2');
      });
    });
  });
});
