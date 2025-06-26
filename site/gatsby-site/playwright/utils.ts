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
import users from './seeds/customData/users';
import authUsers from './seeds/auth/users';
import { algoliaMock } from './fixtures/algoliaMock';

declare module '@playwright/test' {
    interface Request {
        body: any;
    }
}

export type Options = { defaultItem: string };

type TestFixtures = {
    /** 
     * Skips the test when running in an empty environment
     */
    skipOnEmptyEnvironment: () => Promise<void>,

    /**
     * Runs the test only when in an empty environment
     */
    runOnlyOnEmptyEnvironment: () => Promise<void>,

    /**
     * Logs in a user with optional configuration
     * @param options - Optional configuration for the login
     * @param options.email - Optional email to use for login
     * @param options.customData - Optional data to customize the seed user's properties like name and roles
     * @returns Promise resolving to a tuple where:
     *   - First element is the userId, useful for mocking collections to reflect ownership
     *   - Second element is the session token, useful for performing GraphQL queries on behalf of the user
     */
    login: (options?: {
        email?: string,
        customData?: Record<string, unknown>
    }) => Promise<[string, string]>,

    /**
     * Adds an increasing delay after a test failure before retrying
     * The delay increases with each retry attempt
     */
    retryDelay?: [
        ({ }: {}, use: () => Promise<void>, testInfo: { retry: number }) => Promise<void>,
        { auto: true }
    ],

    /**
     * Runs the test only in production environment
     */
    runOnlyInProduction: () => Promise<void>,

    /**
     * Runs the test in any environment except production
     */
    runAnywhereExceptProduction: () => Promise<void>,

    /**
     * Skips the test if the specified language(s) is/are not available in the config's AVAILABLE_LANGUAGES.
     * @param language - A language code or an array of language codes to check.
     */
    skipIfLanguageUnavailable: (language: string | string[]) => Promise<void>,
};

/**
* Random hex string generator from next-auth/core/lib/utils/web.ts.
* Must match original implementation for auth flow compatibility.
* @param size Bytes to generate (output length = size * 2)
*/
export function randomString(size: number) {
    const i2hex = (i: number) => ("0" + i.toString(16)).slice(-2)
    const r = (a: string, i: number): string => a + i2hex(i)
    const bytes = crypto.getRandomValues(new Uint8Array(size))
    return Array.from(bytes).reduce(r, "")
}

export function hashToken(token: string) {

    return crypto.createHash("sha256")
        .update(`${token}${config.NEXTAUTH_SECRET}`)
        .digest("hex");
}

export const generateMagicLink = async (email: string, callbackUrl = '/', roles: string[] = null) => {

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

        if (roles) {

            const result = await client.db('auth').collection('users').updateOne(
                { email },
                { $set: { email, emailVerified: new Date() } },
                { upsert: true }
            );

            const userId = result.upsertedId
                ? result.upsertedId
                : (await client.db('auth').collection('users').findOne({ email }))?._id;

            await client.db('customData').collection('users').updateOne(
                { userId: userId.toString() },
                { $set: { roles, userId: userId.toString() } },
                { upsert: true }
            );
        }
    });

    const baseUrl = config.NEXTAUTH_URL;
    const magicLink = `${baseUrl}/api/auth/callback/http-email?callbackUrl=${encodeURIComponent(baseUrl + callbackUrl)}&token=${token}&email=${encodeURIComponent(email)}`;

    const interstitialLink = `${baseUrl}/magic-link?link=${encodeURIComponent(magicLink)}`;

    return interstitialLink;
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

export const testUser = { ...users[0], email: authUsers.find(u => u._id.equals(new ObjectId(users[0].userId))).email };

export const test = base.extend<TestFixtures>({
    skipOnEmptyEnvironment: async ({ }, use, testInfo) => {
        if (config.IS_EMPTY_ENVIRONMENT == 'true') {
            testInfo.skip();
        }

        await use(null);
    },

    runOnlyOnEmptyEnvironment: async ({ }, use, testInfo) => {
        if (config.IS_EMPTY_ENVIRONMENT == 'false') {
            testInfo.skip();
        }

        await use(null);
    },

    login: async ({ page }, use, testInfo) => {

        await use(async ({ email = testUser.email, customData = null } = {}) => {

            const userId = await getUserIdFromAuth(email);

            if (customData) {

                await memoryMongo.execute(async (client) => {

                    const db = client.db('customData');
                    const collection = db.collection('users');

                    await collection.updateOne({ userId }, { $set: customData }, { upsert: true });
                });
            }

            const magicLink = await generateMagicLink(email);

            await page.context().clearCookies();

            await page.goto(magicLink);

            await page.waitForURL(url => !url.pathname.includes('/magic-link'), { timeout: 10000 });

            const sessionToken = await getSessionToken(userId);

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

    runOnlyInProduction: async ({ }, use, testInfo) => {

        //TODO: introduce a new env variable ENVIRONMENT_NAME to check against
        if (config.SITE_URL !== 'https://incidentdatabase.ai') {
            testInfo.skip();
        }

        await use(null);
    },

    runAnywhereExceptProduction: async ({ }, use, testInfo) => {

        //TODO: introduce a new env variable ENVIRONMENT_NAME to check against
        if (config.SITE_URL === 'https://incidentdatabase.ai') {
            testInfo.skip();
        }
        await use(null);
    },

    skipIfLanguageUnavailable: async ({ }, use, testInfo) => {
        await use(async (language: string | string[]) => {
            const langs = typeof language === 'string' ? [language] : language;
            const availableLanguages = config.AVAILABLE_LANGUAGES.split(',').map(l => l.trim());
            for (const lang of langs) {
                testInfo.skip(!availableLanguages.includes(lang), `Language ${lang} is not available as per AVAILABLE_LANGUAGES config`);
            }
        });
    },
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
            uri: `${config.SITE_URL}/api/graphql`,
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

// TODO: this mock should pull from the database instead of being hardcoded
export async function mockAlgolia(page: Page) {

    await page.route('**/*.algolia.net/1/indexes/*/queries*', async route => {
        const response = await route.fetch();

        await route.fulfill({
            status: 200,
            json: algoliaMock,
            headers: {
                ...response.headers(),
            }
        });
    });

    await page.route('**/*.algolianet.com/1/indexes/*/queries*', async route => {
        const response = await route.fetch();

        await route.fulfill({
            status: 200,
            json: algoliaMock,
            headers: {
                ...response.headers(),
            }
        });
    });
}