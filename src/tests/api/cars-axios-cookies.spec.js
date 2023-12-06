import { expect } from '@playwright/test';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

import { test } from '../../fixtures/test.fixtures';
import {DEFAULT_BRANDS_RESPONSE_BODY} from "../fixtures/brands.js";
import {DEFAULT_BRAND_MODELS} from "../fixtures/models.js";
import axios from "axios";
import {FIRST_USER_CAR_RESPONSE_BODY} from "../fixtures/cars.js";
import {config as testConfig} from "../../../config/config.js";
import {USER} from "../../data/users.js";

test.describe("API requests with axios and cookies jar", ()=> {
    /* HOMEWORK IMPLEMENTATION */
    let client;

    test.beforeAll(async() => {
        const jar = new CookieJar();
        client = wrapper(axios.create({
            baseURL: testConfig.apiURL,
            jar,
            validateStatus: status => {
                return status < 501
            }
        }));

        await client.post('/auth/signin', {
            "email": USER.email,
            "password": USER.password,
            "remember": false
        });

    });
    test("Check the FIRST car of a current user", async () => {
        const userFirstCarId = FIRST_USER_CAR_RESPONSE_BODY.data.id;
        const response = await client.get(`cars/${userFirstCarId}`);

        expect(response.status, 'should return 200 status code').toEqual(200);
        expect(response.data, 'should return default brands').toEqual(FIRST_USER_CAR_RESPONSE_BODY);
    });
    test("Create the BMW car with specific model: X5", async () => {
        const brandId = DEFAULT_BRANDS_RESPONSE_BODY.data[1].id;
        const modelId = DEFAULT_BRAND_MODELS[brandId].data[2].id;

        const requestData = {
            "carBrandId": brandId,
            "carModelId": modelId,
            "mileage": 60
        }

        const response = await client.post('cars', requestData);

        expect(response.status, 'should return 201 status code').toEqual(201);
        expect(response.statusText, 'should return "Created" status').toEqual('Created');
        expect(response.data.data.carBrandId).toEqual(requestData.carBrandId);
        expect(response.data.data.carModelId).toEqual(requestData.carModelId);
        expect(response.data.data.initialMileage).toEqual(requestData.mileage);

        const deleteResponse = await client.delete(`cars/${response.data.data.id}`);
        expect(deleteResponse.status).toEqual(200);
    });
    test("Create the FIAT car with specific model: Punto", async () => {
        const brandId = DEFAULT_BRANDS_RESPONSE_BODY.data[4].id;
        const modelId = DEFAULT_BRAND_MODELS[brandId].data[3].id;

        const requestData = {
            "carBrandId": brandId,
            "carModelId": modelId,
            "mileage": 50
        }

        const response = await client.post('cars', requestData);

        expect(response.status, 'should return 201 status code').toEqual(201);
        expect(response.data.data.carBrandId).toEqual(requestData.carBrandId);
        expect(response.data.data.carModelId).toEqual(requestData.carModelId);
        expect(response.data.data.initialMileage).toEqual(requestData.mileage);

        const deleteResponse = await client.delete(`cars/${response.data.data.id}`);
        expect(deleteResponse.status).toEqual(200);
    });
    test("Check POST request with invalid brand", async () => {
        const brandId = '41';
        const modelId = '100';

        const requestData = {
            "carBrandId": brandId,
            "carModelId": modelId,
            "mileage": 1
        }

        const response = await client.post('cars', requestData);

        await expect(response.status, 'should return not found error code').toEqual(404);
        await expect(response.statusText, 'should return error').toEqual('Not Found');
    });
    test("Check POST request with invalid model", async () => {
        const brandId = DEFAULT_BRANDS_RESPONSE_BODY.data[4].id;
        const modelId = '101';

        const requestData = {
            "carBrandId": brandId,
            "carModelId": modelId,
            "mileage": 9
        }

        const response = await client.post('cars', requestData);

        expect(response.status, 'should return not found error code').toEqual(404);
        expect(response.statusText, 'should return error').toEqual('Not Found');
    });
});
