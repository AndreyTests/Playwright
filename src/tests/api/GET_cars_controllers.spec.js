import {expect, test} from "@playwright/test";
import {USER} from "../../data/users.js";
import {DEFAULT_BRANDS_RESPONSE_BODY} from "../fixtures/brands.js";
import {DEFAULT_MODELS_RESPONSE_BODY} from "../fixtures/models.js";
import ApiClient from "../../client/ApiClient.js";
import {FIRST_USER_CAR_RESPONSE_BODY, USER_CARS_RESPONSE_BODY,} from "../fixtures/cars.js";

test.describe('GET cars', ()=>{
    let client;

    test.beforeAll(async ()=>{
        client = await ApiClient.authorize({
            "email": USER.email,
            "password": USER.password,
            "remember": false
        });
    });
    test('1: GET request: get all current user cars request', async()=>{
        const response = await client.cars.getUserCars();

        expect(response.data.status).toEqual('ok');
        expect(response.data).toEqual(USER_CARS_RESPONSE_BODY);
    });
    test('2: GET request: get current user car by id', async()=>{
        const response = await client.cars.getUserCarById(FIRST_USER_CAR_RESPONSE_BODY.data.id);

        expect(response.data.status).toEqual('ok');
        expect(response.data.data).toEqual(FIRST_USER_CAR_RESPONSE_BODY.data);
    });
    test('3: GET request: get all car brands', async()=>{
        const response = await client.cars.getUserCarBrands();

        expect(response.data.status).toEqual('ok');
        expect(response.data, 'should return default brands').toEqual(DEFAULT_BRANDS_RESPONSE_BODY);

    });
    test('4: GET request: get all car models', async()=>{
        const response = await client.cars.getUserCarModels();

        expect(response.data.status).toEqual('ok');
        expect(response.data, 'should return default models').toEqual(DEFAULT_MODELS_RESPONSE_BODY);

    });
    test('5: GET request invalid: get current user car by wrong id', async()=>{
        const response = await client.cars.getUserCarById('0001a');

        expect(response.data.status).toEqual('error');
        expect(response.statusText).toEqual('Not Found');
    });
    for(const brand of DEFAULT_BRANDS_RESPONSE_BODY.data) (
        test(`6: GET request: get car ${brand.title} by id`, async () => {
            const response = await client.cars.getUserCarBrandById(brand.id);

            expect(response.data.status).toEqual('ok');
            expect(response.data.data).toEqual(DEFAULT_BRANDS_RESPONSE_BODY.data);
        })
    );
})