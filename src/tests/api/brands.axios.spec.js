import { expect } from '@playwright/test';

import { test } from '../../fixtures/test.fixtures';
import {CUSTOM_BRANDS_RESPONSE_BODY, DEFAULT_BRANDS_RESPONSE_BODY} from "../fixtures/brands";
import {DEFAULT_BRAND_MODELS} from "../fixtures/models";
import axios from "axios";
import {USER} from "../../data/users";
import {config as testConfig} from "../../../config/config";

/* APPROACH WITH AXIOS CREATING INSTANCE IN BEFORE ALL AND RETRIEVE COOKIES */
test.describe("API requests with axios", ()=> {
    let client;

    test.beforeAll(async() => {
        client = axios.create({
            baseURL: testConfig.apiURL,
        });

        const responseLogin = await client.post('/auth/signin', {
            "email": USER.email,
            "password": USER.password,
            "remember": false
        });
        const cookies = responseLogin.headers["set-cookie"][0].split(';')[0];

        client = axios.create({
            baseURL: testConfig.apiURL,
            headers: {
                cookies
            },
            validateStatus: status => {
                return status < 501
            }
        });
    });
    test("Check the list of brands", async () => {
        const response = await client.get('/cars/brands');

        expect(response.status, 'should return 200 status code').toEqual(200);
        expect(response.data, 'should return default brands').toEqual(DEFAULT_BRANDS_RESPONSE_BODY);
    });
    test("Check the list of models for a first brand", async () => {
        const brandId = CUSTOM_BRANDS_RESPONSE_BODY.data[0].id;
        const response = await client.get(`cars/models?carBrandId=${brandId}`);

        expect(response.statusText).toEqual('OK');
        expect(response.status, 'should return 200 status code').toEqual(200);
        expect(response.data, 'should return default brands').toEqual(DEFAULT_BRAND_MODELS["1"]);
    });

    for(const brand of DEFAULT_BRANDS_RESPONSE_BODY.data) (
        test(`Check the list of models for ${brand.title} brand`, async () => {
            const response = await client.get(`/cars/models?carBrandId=${brand.id}`);

            expect(response.statusText).toEqual('OK');
            expect(response.status, 'should return 200 status code').toEqual(200);
            expect(response.data, 'should return default brands').toEqual(DEFAULT_BRAND_MODELS[brand.id]);
        })
    );
});