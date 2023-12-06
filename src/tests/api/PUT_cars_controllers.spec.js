import {expect, test} from "@playwright/test";
import {USER} from "../../data/users.js";
import CarModel from "../../models/carModel.js";
import ApiClient from "../../client/ApiClient.js";
import {userCarIDUpdate} from "../fixtures/cars.js";

test.describe('Update Cars', ()=>{
    let client;

    test.beforeAll(async ()=>{
        client = await ApiClient.authorize({
            "email": USER.email,
            "password": USER.password,
            "remember": false
        });
    });
    test('1: PUT request: New mileage is less then previous entry', async()=>{
        const carModel = new CarModel({
            carBrandId: 3, carModelId: 11, mileage: 0});

        const response = await client.cars.updateUserCar(userCarIDUpdate, carModel);

        expect(response.data.status).toEqual('error');
        expect(response.data.message).toEqual('New mileage is less then previous entry');
    });
    test('2: PUT request: update current user car by id', async()=>{
        const carMileage = await client.cars.getUserCarById(userCarIDUpdate);
        const newCarMileage = carMileage.data.data.mileage + 2;
        const carModel = new CarModel({
            carBrandId: 3, carModelId: 11, mileage: newCarMileage});

        const response = await client.cars.updateUserCar(userCarIDUpdate, carModel);

        const expectedBody = {
            ...carModel,
            id: expect.any(Number),
            carBrandId: carModel.carBrandId,
            carCreatedAt: expect.any(String),
            initialMileage: expect.any(Number),
            updatedMileageAt: expect.any(String),
            mileage: carModel.mileage,
            brand: expect.any(String),
            model: expect.any(String),
            logo: expect.any(String),
        }

        expect(response.data.status).toEqual('ok');
        expect(response.data.data).toEqual(expectedBody);
        expect(response.data.data.mileage).toEqual(newCarMileage);
    });
})