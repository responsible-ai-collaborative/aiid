import { Page, Route, test, Request } from '@playwright/test';
import { minimatch } from 'minimatch'

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

        waitForRequestMap.set(alias, page.waitForRequest((req) => minimatch(req.url(), url) && condition(req)));
    }
}

export async function waitForRequest(alias: string) {

    const promise = waitForRequestMap.get(alias);

    waitForRequestMap.delete(alias);

    return promise;
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