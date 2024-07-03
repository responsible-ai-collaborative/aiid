import { ApolloClient, HttpLink, InMemoryCache, OperationVariables, QueryOptions } from '@apollo/client';
import { Page, Route, test as base, Request } from '@playwright/test';
import { minimatch } from 'minimatch'
import config from './config';
import assert from 'node:assert';

declare module '@playwright/test' {
    interface Request {
        body: any;
    }
}

export type Options = { defaultItem: string };

type TestFixtures = {
    skipOnEmptyEnvironment: () => Promise<void>,
    runOnlyOnEmptyEnvironment: () => Promise<void>,
    login: (username: string, password: string, options?: { skipSession?: boolean }) => Promise<void>,
};


export const test = base.extend<TestFixtures>({
    skipOnEmptyEnvironment: async ({ }, use, testInfo) => {
        if (config.IS_EMPTY_ENVIRONMENT) {
            testInfo.skip();
        }

        await use(null);
    },

    runOnlyOnEmptyEnvironment: async ({ }, use, testInfo) => {
        if (!config.IS_EMPTY_ENVIRONMENT) {
            testInfo.skip();
        }

        await use(null);
    },

    login: async ({ page }, use, testInfo) => {

        testInfo.skip(!config.E2E_ADMIN_USERNAME || !config.E2E_ADMIN_PASSWORD, 'E2E_ADMIN_USERNAME or E2E_ADMIN_PASSWORD not set');

        await use(async (email, password, options = { skipSession: false }) => {

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
        })

    }
});

// SEE: https://playwright.dev/docs/api/class-page#page-wait-for-request

const waitForRequestMap = new Map<string, Promise<Request>>();

export async function conditionalIntercept(
    page: Page,
    url: string,
    condition: (request: Request) => boolean,
    responseBody,
    alias: string,
    statusCode: number = 200
) {
    await page.route(url, async (route: Route) => {

        const req = route.request();

        if (condition(req)) {
            await route.fulfill({
                contentType: 'application/json',
                body: JSON.stringify(responseBody),
                status: statusCode
            });
        }
        else {
            await route.fallback();
        }
    });

    // every test should wait for every alias it defines, so we are sure no interception is missed

    assert(!waitForRequestMap.has(alias), `Alias ${alias} already exists`);

    const promise = page
        .waitForResponse((res) => minimatch(res.request().url(), url) && condition(res.request()))
        .then((response) => response.request());

    waitForRequestMap.set(alias, promise);
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

export async function setEditorText(page: Page, value, selector = '.CodeMirror') {
    await page.locator(selector).first().click();
    await page.evaluate(([value, selector]) => {
        document.querySelector(selector).CodeMirror.setValue(value);
    }, [value, selector]);
    await page.mouse.click(0, 0);
}
