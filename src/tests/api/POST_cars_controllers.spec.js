import {expect, test} from "@playwright/test";
import {USER} from "../../data/users.js";
import CreateCarModel from "../../models/createCarModel.js";
import {DEFAULT_BRANDS_RESPONSE_BODY} from "../fixtures/brands.js";
import {DEFAULT_BRAND_MODELS} from "../fixtures/models.js";
import ApiClient from "../../client/ApiClient.js";

test.describe('Create Cars', ()=>{
    let client;
    let carId;

    test.beforeAll(async ()=>{
        client = await ApiClient.authorize({
            "email": USER.email,
            "password": USER.password,
            "remember": false
        });
    });
    test.afterAll(async() => {
        await client.cars.deleteCarById(carId);
    });

    test('1: POST request: should create car with valid data', async()=>{
        const carModel = new CreateCarModel({
            carBrandId: 1, carModelId: 1, mileage: 1000});
        const brand = DEFAULT_BRANDS_RESPONSE_BODY.data.find((brand)=>
            brand.id === carModel.carBrandId);
        const model = DEFAULT_BRAND_MODELS[brand.id].data.find((model)=>
            model.id === carModel.carModelId);
        const response = await client.cars.createCar(carModel);
        carId =  response.data.data.id;

        const expectedBody = {
            ...carModel,
            initialMileage: carModel.mileage,
            id: expect.any(Number),
            carCreatedAt: expect.any(String),
            updatedMileageAt: expect.any(String),
            brand: brand.title,
            model: model.title,
            logo: brand.logoFilename
        }
        expect(response.data.data, 'Returned car object should ba valid').toEqual(expectedBody);
    });
    test('2: POST invalid request: Car brand id is required', async()=>{
        const carModel = new CreateCarModel({});
        const response = await client.cars.createCar(carModel);

        expect(response.data.status).toEqual('error');
        expect(response.data.message).toEqual('Car brand id is required');
    });
    test('3: POST invalid request: Invalid car model type', async()=>{
        const carModel = new CreateCarModel({
            carBrandId: 1, carModelId: null, mileage: 1000
        });
        const response = await client.cars.createCar(carModel);

        expect(response.data.status).toEqual('error');
        expect(response.data.message).toEqual('Invalid car model type');
    });
    test('4: POST invalid request: Invalid mileage type', async()=>{
        const carModel = new CreateCarModel({
            carBrandId: 1, carModelId: 1, mileage: null
        });
        const response = await client.cars.createCar(carModel);

        expect(response.data.status).toEqual('error');
        expect(response.data.message).toEqual('Invalid mileage type');
    });
})