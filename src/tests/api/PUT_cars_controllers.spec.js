import {expect, test} from "@playwright/test";
import {USER} from "../../data/users.js";
import CreateCarModel from "../../models/createCarModel.js";
import ApiClient from "../../client/ApiClient.js";


test.describe('Update Cars', ()=>{
    let client;
    let carId;
    let carModel;

    test.beforeAll(async ()=>{
        client = await ApiClient.authorize({
            "email": USER.email,
            "password": USER.password,
            "remember": false
        });
        carModel = new CreateCarModel({
            carBrandId: 1, carModelId: 1, mileage: 888});
        const response = await client.cars.createCar(carModel);
        carId = response.data.data.id;
    });
    test.afterAll(async() => {
        await client.cars.deleteCarById(carId);
    });
    test('1: PUT request: New mileage is less then previous entry', async()=>{
        const carModel = new CreateCarModel({
            carBrandId: 3, carModelId: 11, mileage: 0});

        const response = await client.cars.updateUserCar(carId, carModel);

        expect(response.data.status).toEqual('error');
        expect(response.data.message).toEqual('New mileage is less then previous entry');
    });
    test('2: PUT invalid request: Car not found', async()=>{
        const response = await client.cars.updateUserCar('0000', carModel);

        expect(response.data.status).toEqual('error');
        expect(response.data.message).toEqual('Car not found');
    });
    test('3: PUT invalid request: empty body', async()=>{
        const response = await client.cars.updateUserCar(carId, null);

        expect(response.data.status).toEqual('error');
        expect(response.data.message).toEqual('Unacceptable fields only or empty body are not allowed');
    });
    test('4: PUT invalid request: invalid fields', async()=>{
        const response = await client.cars.updateUserCar(carId, {test: 'invalid data'});

        expect(response.data.status).toEqual('error');
        expect(response.data.message).toEqual('Unacceptable fields only or empty body are not allowed');
    });
    test('5: PUT invalid request: No valid fields to edit', async()=>{
        const response = await client.cars.updateUserCar(carId, {carModelId: 90});

        expect(response.data.status).toEqual('error');
        expect(response.data.message).toEqual('No valid fields to edit');
    });
})