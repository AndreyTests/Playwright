import { expect } from '@playwright/test';

import { test } from '../fixtures/test.fixtures';
test.describe("Check the garage page view", ()=> {
    test("test", async ({garagePage}) => {
        expect(await garagePage.getMainTitle()).toBe('Hillel Qauto');
        expect(await garagePage.getPageUrl()).toContain('/garage');
    });
});