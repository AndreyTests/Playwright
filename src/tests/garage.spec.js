import { expect } from '@playwright/test';

import { test } from '../fixtures/test.fixtures';
import {brands, CUSTOM_BRANDS_RESPONSE_BODY} from "./fixtures/brands";
import {CUSTOM_MODELS_RESPONSE_BODY, models} from "./fixtures/models";
test.describe("Check the garage page view", ()=> {
    test("Check the main page title and url", async ({garagePage}) => {
        expect(await garagePage.getMainTitle()).toBe('Hillel Qauto');
        expect(await garagePage.getPageUrl()).toContain('/garage');
    });
    test("Check MOCKED requests for Add card modal: Brands", async ({ garagePage }) => {
        const { page } = garagePage;

        await page.route('/api/cars/brands', route => {
            route.fulfill({body: JSON.stringify(CUSTOM_BRANDS_RESPONSE_BODY)})
        });
        await garagePage.addCarBtn.click();
        await garagePage.carBrandsField.click();

        expect(await garagePage.getValues(garagePage.carBrandsField)).toEqual(Object.values(brands));
    });
    test("Check MOCKED requests for Add card modal: Models", async ({ garagePage }) => {
        const brandId = CUSTOM_BRANDS_RESPONSE_BODY.data[0].id;
        const { page } = garagePage;

        await page.route(`/api/cars/models?carBrandId=${brandId}`, route => {
            route.fulfill({ body: JSON.stringify(CUSTOM_MODELS_RESPONSE_BODY)})
        });
        await garagePage.addCarBtn.click();
        await garagePage.carModelsField.click();

        expect(await garagePage.getValues(garagePage.carModelsField)).toEqual(Object.values(models));
    });
});