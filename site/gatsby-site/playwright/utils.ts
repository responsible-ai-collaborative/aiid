import { test } from '@playwright/test';

export function conditionalIt(condition: boolean, description: string, fn: any) {
    if (condition) {
        test(description, fn);
    }
}
