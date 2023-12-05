import {expect, test} from "@playwright/test";
import {USER} from "../../data/users.js";
import CarModel from "../../models/carModel.js";
import ApiClient from "../../client/ApiClient.js";

test.describe('Remove Cars', ()=>{
    let client;
    let carId;

    test.beforeAll(async ()=>{
        client = await ApiClient.authorize({
            "email": USER.email,
            "password": USER.password,
            "remember": false
        });
    });
    test.beforeEach(async ()=>{
        const carModel = new CarModel({
            carBrandId: 1, carModelId: 1, mileage: 888});
        const response = await client.cars.createCar(carModel);
        carId = response.data.data.id;

    });
    test('1: DELETE: remove the last user car', async()=>{
        const response = await client.cars.deleteCarById(carId);

        expect(response.data.status).toEqual('ok');
        const getResponse = await client.cars.getUserCarById(carId);
        expect(getResponse.status).toEqual(404);
    });
})