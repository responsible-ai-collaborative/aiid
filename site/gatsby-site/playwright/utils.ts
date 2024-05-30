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

export async function conditionalIntercept(
    page: Page,
    url: string,
    condition: (request: Request) => boolean,
    response,
    options = { ignoreWait: false }
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

    if (!options.ignoreWait) {

        const request = page.waitForRequest((req) => minimatch(req.url(), url) && condition(req));

        return [request];
    }
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