import { expect } from '@playwright/test';

import { test } from '../fixtures/test.fixtures';
import {CUSTOM_BRANDS_RESPONSE_BODY, DEFAULT_BRANDS_RESPONSE_BODY} from "./fixtures/brands";
import {DEFAULT_BRAND_MODELS} from "./fixtures/models";
test.describe("API requests", ()=> {
    test("Check the list of brands", async ({userApiClient}) => {
            const response = await userApiClient.fetch('/api/cars/brands');
            const body = await response.json();

            await expect(response, 'should return positive status').toBeOK();
            await expect(response.status(), 'should return 200 status code').toEqual(200);
            expect(body, 'should return default brands').toEqual(DEFAULT_BRANDS_RESPONSE_BODY);
    });
    test("Check the list of models for a first brand", async ({userApiClient}) => {
        const brandId = CUSTOM_BRANDS_RESPONSE_BODY.data[0].id;
        const response = await userApiClient.fetch(`/api/cars/models?carBrandId=${brandId}`);
        const body = await response.json();

        await expect(response, 'should return positive status').toBeOK();
        await expect(response.status(), 'should return 200 status code').toEqual(200);
        expect(body, 'should return default brands').toEqual(DEFAULT_BRAND_MODELS["1"]);
    });

    for(const brand of DEFAULT_BRANDS_RESPONSE_BODY.data) (
        test(`Check the list of models for ${brand.title} brand`, async ({userApiClient}) => {
            const response = await userApiClient.fetch(`/api/cars/models?carBrandId=${brand.id}`);
            const body = await response.json();

            await expect(response, 'should return positive status').toBeOK();
            await expect(response.status(), 'should return 200 status code').toEqual(200);
            expect(body, 'should return default brands').toEqual(DEFAULT_BRAND_MODELS[brand.id]);
        })
    );
});
