import { ApolloClient, HttpLink, InMemoryCache, OperationVariables, QueryOptions } from '@apollo/client';
import { Page, Route, test, Request } from '@playwright/test';
import { minimatch } from 'minimatch'
import config from './config';
import assert from 'node:assert';

declare module '@playwright/test' {
    interface Request {
        body: any;
    }
}

export function conditionalIt(condition: boolean, description: string, fn: any) {
    if (condition) {
        test(description, fn);
    }
}

export const maybeIt = config.E2E_ADMIN_USERNAME && config.E2E_ADMIN_PASSWORD ? test : test.skip;


// SEE: https://playwright.dev/docs/api/class-page#page-wait-for-request

const waitForRequestMap = new Map<string, Promise<Request>>();

export async function conditionalIntercept(
    page: Page,
    url: string,
    condition: (request: Request) => boolean,
    response,
    alias: string = null
) {
    await page.route(url, async (route: Route) => {

        const req = route.request();

        if (condition(req)) {
            await route.fulfill({
                contentType: 'application/json',
                body: JSON.stringify(response),
            });
        }
        else {
            await route.fallback();
        }
    });

    if (alias) {

        assert(!waitForRequestMap.has(alias), `Alias ${alias} already exists`);

        waitForRequestMap.set(alias, page.waitForRequest((req) => minimatch(req.url(), url) && condition(req)));
    }
}

export async function waitForRequest(alias: string) {

    const promise = waitForRequestMap.get(alias);

    waitForRequestMap.delete(alias);

    return promise!;
}


export async function mockDate(page: Page, date: Date) {

    const timestamp = date.valueOf();

    await page.addInitScript(`{
      Date = class extends Date {
        constructor(...args) {
          if (args.length === 0) {
            super(${timestamp});
          } else {
            super(...args);
          }
        }
      }
  
      const __DateNowOffset = ${timestamp} - Date.now();
      const __DateNow = Date.now;
      Date.now = () => __DateNow() + __DateNowOffset;
    }`);
}

export const getApolloClient = () => {

    const client = new ApolloClient({
        link: new HttpLink({
            uri: `http://localhost:8000/api/graphql`,

            fetch: async (uri, options) => {
                options.headers.email = config.E2E_ADMIN_USERNAME!;
                options.headers.password = config.E2E_ADMIN_PASSWORD!;

                return fetch(uri, options);
            },
        }),
        cache: new InMemoryCache(),
    });

    return client;
};

const client = getApolloClient();

export function query(data: QueryOptions<OperationVariables, any>) {

    const { query, variables } = data

    return client.query({ query, variables });
}

const loginSteps = async (page: Page, email: string, password: string) => {
    await page.goto('/login');

    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('[data-cy="login-btn"]');

    await page.waitForURL(url => !url.toString().includes('/login'));
};

export async function login(page: Page, email: string, password: string, options: { skipSession?: boolean } = { skipSession: false }) {
    if (options.skipSession) {
        await loginSteps(page, email, password);
    } else {
        const sessionState = await page.context().storageState();
        if (!sessionState || sessionState.cookies.length === 0) {
            await page.context().clearCookies();
            await loginSteps(page, email, password);
            await page.context().storageState({ path: 'session.json' });
        } else {

            // to be able to restore session state, we'll need to refactor when we perform the login call, but that's for another PR
            // https://playwright.dev/docs/auth#avoid-authentication-in-some-tests

            await page.context().addCookies(sessionState.cookies);
        }
    }
}

export async function setEditorText(page: Page, value, selector = '.CodeMirror') {
    await page.locator(selector).first().click();
    await page.evaluate(([value, selector]) => {
        document.querySelector(selector).CodeMirror.setValue(value);
    }, [value, selector]);
    await page.mouse.click(0, 0);
}
