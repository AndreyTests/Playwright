import { expect } from '@playwright/test';

import { test } from '../fixtures/test.fixtures';
import {DEFAULT_BRANDS_RESPONSE_BODY} from "./fixtures/brands";
import {DEFAULT_BRAND_MODELS} from "./fixtures/models";
import {FIRST_USER_CAR_RESPONSE_BODY} from "./fixtures/cars";
test.describe("API requests", ()=> {
    /* SECOND TASK IMPLEMENTATION */
    test("Check the FIRST car of a current user", async ({userApiClient}) => {
        const userFirstCarId = FIRST_USER_CAR_RESPONSE_BODY.data.id;
        const response = await userApiClient.fetch(`/api/cars/${userFirstCarId}`);
        const body = await response.json();

        await expect(response, 'should return positive status').toBeOK();
        await expect(response.status(), 'should return 200 status code').toEqual(200);
        expect(body, 'should return default brands').toEqual(FIRST_USER_CAR_RESPONSE_BODY);
    });
    test("Create the BMW car with specific model: X5", async ({userApiClient}) => {
        const brandId = DEFAULT_BRANDS_RESPONSE_BODY.data[1].id;
        const modelId = DEFAULT_BRAND_MODELS[brandId].data[2].id;

        const requestData = {
            "carBrandId": brandId,
            "carModelId": modelId,
            "mileage": 99
        }

        const response = await userApiClient.post('/api/cars', {
            data: requestData
        });
        const body = await response.json();

        await expect(response, 'should return positive status').toBeOK();
        await expect(response.status(), 'should return 201 status code').toEqual(201);
        expect(body.status).toBe('ok');
        expect(body.data, 'valid car created').toMatchObject(requestData);
    });
    test("Create the FIAT car with specific model: Punto", async ({userApiClient}) => {
        const brandId = DEFAULT_BRANDS_RESPONSE_BODY.data[4].id;
        const modelId = DEFAULT_BRAND_MODELS[brandId].data[3].id;

        const requestData = {
            "carBrandId": brandId,
            "carModelId": modelId,
            "mileage": 80
        }

        const response = await userApiClient.post('/api/cars', {
            data: requestData
        });
        const body = await response.json();

        await expect(response, 'should return positive status').toBeOK();
        await expect(response.status(), 'should return 201 status code').toEqual(201);
        expect(body.status).toBe('ok');
        expect(body.data, 'valid car created').toMatchObject(requestData);
    });
    test("Check POST request with invalid brand", async ({userApiClient}) => {
        const brandId = '41';
        const modelId = '100';

        const requestData = {
            "carBrandId": brandId,
            "carModelId": modelId,
            "mileage": 1
        }

        const response = await userApiClient.post('/api/cars', {
            data: requestData
        });

        await expect(response, 'should return error').not.toBeOK();
        await expect(response.status(), 'should return not found error').toEqual(404);
        await expect(response.statusText(), 'should return error').toEqual('Not Found');
    });
    test("Check POST request with invalid model", async ({userApiClient}) => {
        const brandId = DEFAULT_BRANDS_RESPONSE_BODY.data[4].id;
        const modelId = '101';

        const requestData = {
            "carBrandId": brandId,
            "carModelId": modelId,
            "mileage": 9
        }

        const response = await userApiClient.post('/api/cars', {
            data: requestData
        });

        await expect(response, 'should return error').not.toBeOK();
        await expect(response.status(), 'should return not found error').toEqual(404);
        await expect(response.statusText(), 'should return error').toEqual('Not Found');
    });
});
