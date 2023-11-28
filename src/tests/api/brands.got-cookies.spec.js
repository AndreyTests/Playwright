import { CookieJar } from 'tough-cookie';
import { test } from '../../fixtures/test.fixtures';
import { expect } from '@playwright/test';
import {config as testConfig} from "../../../config/config";
import { got } from 'got';
import {CUSTOM_BRANDS_RESPONSE_BODY, DEFAULT_BRANDS_RESPONSE_BODY} from "../fixtures/brands";
import {DEFAULT_BRAND_MODELS} from "../fixtures/models";
import {USER} from "../../data/users";

/* APPROACH WITH GOT */
test.describe("API requests with got and axios cookies jar", ()=> {
    let client;

    test.beforeAll(async() => {
        const jar = new CookieJar();
        client = got.extend({
            prefixUrl: testConfig.apiURL,
            cookieJar: jar
        });
        await client.post('auth/signin', {
            json: {
                "email": USER.email,
                "password": USER.password,
                "remember": false
            }
        });
    });
    test("Check the list of cars", async () => {
        const response = await client.get('cars');

        expect(response.statusCode, 'should return 200 status code').toEqual(200);
    });
    test("Check the list of models for a first brand", async () => {
        const brandId = CUSTOM_BRANDS_RESPONSE_BODY.data[0].id;
        const response = await client.get(`cars/models?carBrandId=${brandId}`);

        const responseBody = JSON.parse(response.body);

        expect(response.statusCode, 'should return 200 status code').toEqual(200);
        expect(responseBody, 'should return default brands').toEqual(DEFAULT_BRAND_MODELS["1"]);
    });

    for(const brand of DEFAULT_BRANDS_RESPONSE_BODY.data) (
        test(`Check the list of models for ${brand.title} brand`, async () => {
            const response = await client.get(`cars/models?carBrandId=${brand.id}`);
            const responseBody = JSON.parse(response.body);

            expect(response.statusCode, 'should return 200 status code').toEqual(200);
            expect(responseBody, 'should return default brands').toEqual(DEFAULT_BRAND_MODELS[brand.id]);
        })
    );
});