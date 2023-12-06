import {expect, test} from "@playwright/test";
import {USER} from "../../data/users.js";
import CarModel from "../../models/carModel.js";
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
    test.afterEach(async() => {
        const response = await client.cars.deleteCarById(carId);

        expect(response.data.status).toEqual('ok');
    })
    test('1: POST request: should create car with valid data', async()=>{
        const carModel = new CarModel({
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
})