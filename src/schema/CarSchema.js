import * as zod from 'zod'

export const CarSchema = zod.object({
    "brand": zod.string(),
    "carBrandId": zod.number().min(1),
    "carCreatedAt": zod.string().datetime(),
    "carModelId": zod.number().min(1),
    "id": zod.number(),
    "initialMileage":  zod.number().min(1),
    "logo": zod.string(),
    "mileage":  zod.number().min(1),
    "model": zod.string(),
    "updatedMileageAt": zod.string().datetime()
});