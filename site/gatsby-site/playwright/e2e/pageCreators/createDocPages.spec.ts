import path from 'path';
import sinon from 'sinon';
import createDocPages from '../../../page-creators/createDocPages';
import { CreatePagesArgs } from 'gatsby';
import { expect } from '@playwright/test';
import { test } from '../../utils';

test.describe('createDocPages', () => {
  let graphql: sinon.SinonStub;
  let createPage: sinon.SinonSpy;
  let reporter: { warn: sinon.SinonSpy };

  test.beforeEach(() => {
    graphql = sinon.stub();
    createPage = sinon.spy();
    reporter = { warn: sinon.spy() };
  });

  test.afterEach(() => {
    sinon.restore();
  });

  test('Creates pages for Prismic docs and MDX files', async () => {
    const response = {
      data: {
        allPrismicDoc: {
          edges: [
            { node: { data: { slug: 'doc-1-prismic' } } },
            { node: { data: { slug: 'doc-2-prismic' } } },
          ],
        },
        allFile: {
          nodes: [
            {
              childMdx: {
                frontmatter: { slug: 'doc-1' },
                internal: { contentFilePath: 'doc-1.mdx' },
              },
            },
            {
              childMdx: {
                frontmatter: { slug: 'doc-2' },
                internal: { contentFilePath: 'doc-2.mdx' },
              },
            },
          ],
        },
      },
    };

    graphql.resolves(response);

    await createDocPages(graphql as unknown as CreatePagesArgs['graphql'], createPage, { reporter });

    // Assert Prismic pages
    expect(createPage.calledWithMatch({
      path: 'doc-1-prismic',
      component: `${path.resolve('./src/templates/prismicDoc.js')}`,
      context: { slug: 'doc-1-prismic' },
    })).toBe(true);

    expect(createPage.calledWithMatch({
      path: 'doc-2-prismic',
      component: `${path.resolve('./src/templates/prismicDoc.js')}`,
      context: { slug: 'doc-2-prismic' },
    })).toBe(true);

    // Assert MDX pages
    expect(createPage.calledWithMatch({
      path: 'doc-1',
      component: `${path.resolve('./src/templates/doc.js')}?__contentFilePath=doc-1.mdx`,
      context: { slug: 'doc-1' },
    })).toBe(true);

    expect(createPage.calledWithMatch({
      path: 'doc-2',
      component: `${path.resolve('./src/templates/doc.js')}?__contentFilePath=doc-2.mdx`,
      context: { slug: 'doc-2' },
    })).toBe(true);

    // Assert total calls
    expect(createPage.callCount).toEqual(4);
  });

  test('Warns when a Prismic doc is missing a slug', async () => {
    const response = {
      data: {
        allPrismicDoc: {
          edges: [{ node: { data: { slug: null, title: 'Missing Slug Doc' } } }],
        },
        allFile: { nodes: [] },
      },
    };

    graphql.resolves(response);

    await createDocPages(graphql as unknown as CreatePagesArgs['graphql'], createPage, { reporter });

    expect(reporter.warn.calledWithMatch('Missing slug for Missing Slug Doc')).toBe(true);
    expect(createPage.notCalled).toBe(true);
  });

  test('Warns when an MDX file is missing a slug', async () => {
    const response = {
      data: {
        allPrismicDoc: { edges: [] },
        allFile: {
          nodes: [
            {
              childMdx: {
                frontmatter: { slug: null, title: 'Missing Slug Doc' },
              },
              absolutePath: '/path/to/missing-slug.mdx',
            },
          ],
        },
      },
    };

    graphql.resolves(response);

    await createDocPages(graphql as unknown as CreatePagesArgs['graphql'], createPage, { reporter });

    expect(reporter.warn.calledWithMatch('Missing slug for /path/to/missing-slug.mdx')).toBe(true);
    expect(createPage.notCalled).toBe(true);
  });
});
