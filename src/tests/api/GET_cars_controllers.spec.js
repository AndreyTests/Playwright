import {expect, test} from "@playwright/test";
import {USER} from "../../data/users.js";
import {DEFAULT_BRANDS_RESPONSE_BODY} from "../fixtures/brands.js";
import {DEFAULT_BRAND_MODELS, DEFAULT_MODELS_RESPONSE_BODY} from "../fixtures/models.js";
import ApiClient from "../../client/ApiClient.js";
import CreateCarModel from "../../models/CreateCarModel.js";
import {CarSchema} from "../../schema/CarSchema.js";
import {USER_CARS_RESPONSE_BODY} from "../fixtures/cars.js";

test.describe('GET all cars', ()=> {
    let client;
    let carId;
    let carModel;
    let brand;
    let model;

    test.beforeAll(async () => {
        client = await ApiClient.authorize({
            "email": USER.email,
            "password": USER.password,
            "remember": false
        });
        carModel = new CreateCarModel({
            carBrandId: 1, carModelId: 1, mileage: 111});
        brand = DEFAULT_BRANDS_RESPONSE_BODY.data.find((brand)=>
            brand.id === carModel.carBrandId);
        model = DEFAULT_BRAND_MODELS[brand.id].data.find((model)=>
            model.id === carModel.carModelId);
        const response = await client.cars.createCar(carModel);
        carId = response.data.data.id;
    });
    test.afterAll(async() => {
        const response = await client.cars.deleteCarById(carId);

        expect(response.data.status).toEqual('ok');
    })
});

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
        const response = await client.cars.getUserCarById(carId);
        const expectedResponse = {
            ...carModel,
            brand: brand.title,
            carBrandId: carModel.carBrandId,
            carCreatedAt: expect.any(String),
            carModelId: carModel.carModelId,
            id: carId,
            initialMileage: carModel.mileage,
            logo: 'audi.png',
            mileage: carModel.mileage,
            model: model.title,
            updatedMileageAt: expect.any(String)
        };
        CarSchema.parse(response.data.data);

        expect(response.data.status).toEqual('ok');
        expect(response.data.data).toEqual(expectedResponse);
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
    test('5: GET request: get car model by id', async()=>{
        const response = await client.cars.getUserCarModelsById(model.id);

        expect(response.data.status).toEqual('ok');
        expect(response.data.data.title).toEqual(model.title);

    });
    test('6: GET request invalid: get car model by wrong id', async()=>{
        const response = await client.cars.getUserCarModelsById('00000');

        expect(response.data.status).toEqual('error');
        expect(response.statusText).toEqual('Not Found');
    });
    test('7: GET request invalid: get current user car by wrong id', async()=>{
        const response = await client.cars.getUserCarById('0001a');

        expect(response.data.status).toEqual('error');
        expect(response.statusText).toEqual('Not Found');
    });
    for(const brand of DEFAULT_BRANDS_RESPONSE_BODY.data) (
        test(`8: GET request: get car ${brand.title} by id`, async () => {
            const response = await client.cars.getUserCarBrandById(brand.id);

            expect(response.data.status).toEqual('ok');
            expect(response.data.data).toEqual(DEFAULT_BRANDS_RESPONSE_BODY.data);
        })
    );
})