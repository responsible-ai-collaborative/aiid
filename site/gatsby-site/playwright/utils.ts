import { ApolloClient, HttpLink, InMemoryCache, OperationVariables, QueryOptions } from '@apollo/client';
import { Page, Route, test as base, Request, expect } from '@playwright/test';
import { minimatch } from 'minimatch'
import config from './config';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import * as memoryMongo from './memory-mongo';
import * as crypto from 'node:crypto';
import { ObjectId } from 'bson';

declare module '@playwright/test' {
    interface Request {
        body: any;
    }
}

export type Options = { defaultItem: string };

type TestFixtures = {
    skipOnEmptyEnvironment: () => Promise<void>,
    runOnlyOnEmptyEnvironment: () => Promise<void>,
    login: (options?: { email?: string, customData?: Record<string, unknown> }) => Promise<string[]>,
    retryDelay?: [({ }: {}, use: () => Promise<void>, testInfo: { retry: number }) => Promise<void>, { auto: true }],
};

export function randomString(size: number) {
    const i2hex = (i: number) => ("0" + i.toString(16)).slice(-2)
    const r = (a: string, i: number): string => a + i2hex(i)
    const bytes = crypto.getRandomValues(new Uint8Array(size))
    return Array.from(bytes).reduce(r, "")
}

export function hashToken(token: string) {

    return crypto.createHash("sha256")
        .update(`${token}${process.env.NEXTAUTH_SECRET}`)
        .digest("hex");
}

async function generateMagicLink(email: string) {

    const token = randomString(32);
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await memoryMongo.execute(async (client) => {

        const collection = client.db('auth').collection('verification_tokens');
        const hashedToken = hashToken(token); // next auth stores the hashed token

        await collection.insertOne({
            identifier: email,
            token: hashedToken,
            expires,
        });
    });

    const baseUrl = process.env.NEXTAUTH_URL;
    const magicLink = `${baseUrl}/api/auth/callback/http-email?callbackUrl=http%3A%2F%2Flocalhost%3A8000%2F&token=${token}&email=${encodeURIComponent(email)}`;

    return magicLink;
}

async function getUserIdFromAuth(email: string) {

    let id: string = null;

    await memoryMongo.execute(async (client) => {

        const collection = client.db('auth').collection('users');

        const user = await collection.findOne({ email });

        id = user._id.toString();
    });

    return id;
}

async function getSessionToken(userId: string) {

    let token: string = null;

    await memoryMongo.execute(async (client) => {

        const collection = client.db('auth').collection('sessions');

        const session = await collection.findOne({ userId: new ObjectId(userId) }, { sort: { expires: -1 } });

        token = session.sessionToken;
    });

    return token;
}

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

        // TODO: this should be removed since we pass the username and password as arguments
        testInfo.skip(!config.E2E_ADMIN_USERNAME || !config.E2E_ADMIN_PASSWORD, 'E2E_ADMIN_USERNAME or E2E_ADMIN_PASSWORD not set');

        await use(async ({ email = "test.user@incidentdatabase.ai", customData = null } = {}) => {

            const magicLink = await generateMagicLink(email);

            await page.context().clearCookies();

            await page.goto(magicLink);

            const userId = await getUserIdFromAuth(email);

            const sessionToken = await getSessionToken(userId);

            if (customData) {

                await memoryMongo.execute(async (client) => {

                    const db = client.db('customData');
                    const collection = db.collection('users');

                    await collection.updateOne({ userId }, { $set: customData }, { upsert: true });
                });
            }

            return [userId!, sessionToken!];
        })
    },

    retryDelay: [async ({ }, use, testInfo) => {

        if (testInfo.retry > 0) {
            const delayDuration = 1000 * testInfo.retry;

            console.log(`Adding delay of ${delayDuration} ms for retry count ${testInfo.retry}`);

            await new Promise(resolve => setTimeout(resolve, delayDuration));
        }

        await use();
    }, { auto: true }],
});

// SEE: https://playwright.dev/docs/api/class-page#page-wait-for-request

const waitForRequestMap = new Map<string, Promise<Request>>();


export const trackRequest = async (page: Page, url: string, condition: (request: Request) => boolean, alias: string) => {

    // every test should wait for every alias it defines, so we are sure no interception is missed

    assert(!waitForRequestMap.has(alias), `Alias ${alias} already exists`);

    const promise = page
        .waitForResponse((res) => minimatch(res.request().url(), url) && condition(res.request()))
        .then((response) => response.request());

    waitForRequestMap.set(alias, promise);
}

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

    trackRequest(page, url, condition, alias);
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
        cache: new InMemoryCache({
            addTypename: false,
        }),
    });

    return client;
};

const client = getApolloClient();

export function query(data: QueryOptions<OperationVariables, any>, headers = {}) {

    const { query, variables } = data

    return client.query({ query, variables, fetchPolicy: 'no-cache', context: { headers } });
}

const loginSteps = async (page: Page, email: string, password: string) => {
    await page.goto('/login');

    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('[data-cy="login-btn"]');

    await page.waitForURL(url => !url.toString().includes('/login'));
};

export async function getEditorText(page: Page, selector: string = '.CodeMirror'): Promise<string> {
    return await page.evaluate(
        (selector) => {
            const editor = document.querySelector(selector) as HTMLElement & { CodeMirror?: any };
            return editor?.CodeMirror ? editor.CodeMirror.getValue() : '';
        },
        selector
    );
}

export async function setEditorText(page: Page, value, selector = '.CodeMirror') {
    await page.locator(selector).first().click();
    await page.evaluate(([value, selector]) => {
        document.querySelector(selector).CodeMirror.setValue(value);
    }, [value, selector]);
    await page.mouse.click(0, 0);
}


export async function listFiles(directoryPath: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                reject(err);
            } else {
                const jsonFiles = files.filter((file) => {
                    return (
                        path.extname(file).toLowerCase() === '.json' &&
                        fs.statSync(path.join(directoryPath, file)).isFile()
                    );
                });

                resolve(jsonFiles);
            }
        });
    });
}

export async function fillAutoComplete(page: Page, selector: string, sequence: string, target: string) {

    await expect(async () => {
        await page.locator(selector).clear();
        await page.waitForTimeout(1000);
        await page.locator(selector).pressSequentially(sequence.substring(0, Math.floor(Math.random() * sequence.length) + 1), { delay: 500 });
        await page.getByText(target).first().click({ timeout: 1000 });
    }).toPass();
}

//TODO: This function should be removed and the languages should be fetched from the config files
export function getLanguages() {
    return [
        { code: 'en', hrefLang: 'en-US', name: 'English', localName: 'English', langDir: 'ltr', dateFormat: 'MM/DD/YYYY' },
        { code: 'es', hrefLang: 'es', name: 'Spanish', localName: 'Español', langDir: 'ltr', dateFormat: 'DD-MM-YYYY' },
        { code: 'fr', hrefLang: 'fr', name: 'French', localName: 'Français', langDir: 'ltr', dateFormat: 'DD-MM-YYYY' },
        { code: 'ja', hrefLang: 'ja', name: 'Japanese', localName: '日本語', langDir: 'ltr', dateFormat: 'YYYY/MM/DD' },
    ];
}
