import { expect } from '@playwright/test';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

import { test } from '../../fixtures/test.fixtures';
import {CUSTOM_BRANDS_RESPONSE_BODY, DEFAULT_BRANDS_RESPONSE_BODY} from "../fixtures/brands";
import {DEFAULT_BRAND_MODELS} from "../fixtures/models";
import axios from "axios";
import {USER} from "../../data/users";
import {config as testConfig} from "../../../config/config";

/* APPROACH WITH AXIOS COOKIES JAR */
test.describe.skip("API requests with axios cookies jar", ()=> {
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
    test("Check the list of cars", async () => {
        const response = await client.get('/cars');

        expect(response.status, 'should return 200 status code').toEqual(200);
    });
    test("Check the list of brands", async () => {
        const response = await client.get('/cars/brands');

        expect(response.status, 'should return 200 status code').toEqual(200);
        expect(response.data, 'should return default brands').toEqual(DEFAULT_BRANDS_RESPONSE_BODY);
    });
    test("Check the list of models for a first brand", async ({userApiClient}) => {
        const brandId = CUSTOM_BRANDS_RESPONSE_BODY.data[0].id;
        const response = await client.get(`cars/models?carBrandId=${brandId}`);

        expect(response.statusText).toEqual('OK');
        expect(response.status, 'should return 200 status code').toEqual(200);
        expect(response.data, 'should return default brands').toEqual(DEFAULT_BRAND_MODELS["1"]);
    });

    for(const brand of DEFAULT_BRANDS_RESPONSE_BODY.data) (
        test(`Check the list of models for ${brand.title} brand`, async ({userApiClient}) => {
            const response = await client.get(`/cars/models?carBrandId=${brand.id}`);

            expect(response.statusText).toEqual('OK');
            expect(response.status, 'should return 200 status code').toEqual(200);
            expect(response.data, 'should return default brands').toEqual(DEFAULT_BRAND_MODELS[brand.id]);
        })
    );
});