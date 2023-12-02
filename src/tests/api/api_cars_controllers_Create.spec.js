import {expect, test} from "@playwright/test";
import ApiClient from "../../client/ApiClient.js";
import {USER} from "../../data/users.js";
import CreateCarModel from "../../models/carModel.js";
import {DEFAULT_BRANDS_RESPONSE_BODY} from "../fixtures/brands.js";
import {DEFAULT_BRAND_MODELS} from "../fixtures/models.js";

test.describe('Cars', ()=>{
    let client

    test.beforeAll(async ()=>{
        client = await ApiClient.authenticate({
            "email": USER.email,
            "password": USER.password,
        "remember": false
        })
    })
    test('should create car with valid data', async()=>{
        const carModel = new CreateCarModel({carBrandId:1, carModelId:1, mileage:200})
        const brand = DEFAULT_BRANDS_RESPONSE_BODY.data.find((brand)=> brand.id === carModel.carBrandId);
        const model = DEFAULT_BRAND_MODELS[brand.id].data.find((model)=>model.id === carModel.carModelId);
        const response = await client.cars.createCar(carModel)

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
        expect(response.data.data, 'Returned car object should be valid').toEqual(expectedBody)
    })
})
