import {expect, test} from "@playwright/test";
import {USER} from "../../data/users.js";
import CarModel from "../../../models/carModel.js";
import {DEFAULT_BRANDS_RESPONSE_BODY} from "../fixtures/brands.js";
import {DEFAULT_BRAND_MODELS, DEFAULT_MODELS_RESPONSE_BODY} from "../fixtures/models.js";
import ApiClient from "../../client/ApiClient.js";
import {FIRST_USER_CAR_RESPONSE_BODY, userCarIDUpdate} from "../fixtures/cars.js";

test.describe('Cars', ()=>{
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
        expect(response.data.data.some(item => item.id === FIRST_USER_CAR_RESPONSE_BODY.data.id)).toBe(true);
    });
    test('2: GET request: get current user car by id', async()=>{
        const response = await client.cars.getUserCarById(FIRST_USER_CAR_RESPONSE_BODY.data.id);

        expect(response.data.status).toEqual('ok');
        expect(response.data.data).toEqual(FIRST_USER_CAR_RESPONSE_BODY.data);
    });
    test('3: POST request: should create car with valid data', async()=>{
        const carModel = new CarModel({
            carBrandId: 1, carModelId: 1, mileage: 1000});
        const brand = DEFAULT_BRANDS_RESPONSE_BODY.data.find((brand)=>
            brand.id === carModel.carBrandId);
        const model = DEFAULT_BRAND_MODELS[brand.id].data.find((model)=>
            model.id === carModel.carModelId);
        const response = await client.cars.createCar(carModel);

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
    test('4: PUT request: New mileage is less then previous entry', async()=>{
        const carModel = new CarModel({
            carBrandId: 3, carModelId: 11, mileage: 0});

        const response = await client.cars.updateUserCar(userCarIDUpdate, carModel);

        expect(response.data.status).toEqual('error');
        expect(response.data.message).toEqual('New mileage is less then previous entry');
    });
    test('5: PUT request: update current user car by id', async()=>{
        const carMileage = await client.cars.getUserCarById(userCarIDUpdate);
        const newCarMileage = carMileage.data.data.mileage + 2;
        const carModel = new CarModel({
            carBrandId: 3, carModelId: 11, mileage: newCarMileage});

        const response = await client.cars.updateUserCar(userCarIDUpdate, carModel);

        expect(response.data.status).toEqual('ok');
        expect(response.data.data.mileage).toEqual(newCarMileage);
    });
    test('6: DELETE: remove the last user car', async()=>{
        const carId = await client.cars.getSpecificCarId();
        const response = await client.cars.deleteCarById(carId);

        expect(response.data.status).toEqual('ok');
        const getResponse = await client.cars.getUserCarById(carId);
        expect(getResponse.status).toEqual(404);
    });
    test('7: GET request: get all car brands', async()=>{
        const response = await client.cars.getUserCarBrands();

        expect(response.data.status).toEqual('ok');
        expect(response.data, 'should return default brands').toEqual(DEFAULT_BRANDS_RESPONSE_BODY);

    });
    test('8: GET request: get all car models', async()=>{
        const response = await client.cars.getUserCarModels();

        expect(response.data.status).toEqual('ok');
        expect(response.data, 'should return default models').toEqual(DEFAULT_MODELS_RESPONSE_BODY);

    });
    for(const brand of DEFAULT_BRANDS_RESPONSE_BODY.data) (
        test(`9: GET request: get car ${brand.title} by id`, async () => {
            const response = await client.cars.getUserCarBrandById(brand.id);

            expect(response.data.status).toEqual('ok');
            expect(response.data.data).toEqual(DEFAULT_BRANDS_RESPONSE_BODY.data);
        })
    );
})