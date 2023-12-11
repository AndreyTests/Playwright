import {expect} from "@playwright/test";

export const FIRST_USER_CAR_RESPONSE_BODY = {
    "status": "ok",
    "data":
        {
            "id": 68533,
            "carBrandId": 1,
            "carModelId": 2,
            "initialMileage": 122,
            "updatedMileageAt": "2023-11-24T19:20:46.000Z",
            "carCreatedAt": "2023-11-24T19:20:46.000Z",
            "mileage": 122,
            "brand": "Audi",
            "model": "R8",
            "logo": "audi.png"
        }
};

export const USER_CARS_RESPONSE_BODY = {
    "status": "ok",
    "data": [
        {
            "id": 69221,
            "carBrandId": 3,
            "carModelId": 11,
            "initialMileage": expect.any(Number),
            "updatedMileageAt": expect.any(String),
            "carCreatedAt": expect.any(String),
            "mileage": expect.any(Number),
            "brand": "Ford",
            "model": "Fiesta",
            "logo": "ford.png"
        },
        {
            "id": 68533,
            "carBrandId": 1,
            "carModelId": 2,
            "initialMileage": 122,
            "updatedMileageAt": "2023-11-24T19:20:46.000Z",
            "carCreatedAt": "2023-11-24T19:20:46.000Z",
            "mileage": 122,
            "brand": "Audi",
            "model": "R8",
            "logo": "audi.png"
        }
    ]
};
