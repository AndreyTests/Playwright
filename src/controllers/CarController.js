import BaseController from "./BaseController.js";

export default class CarController extends BaseController{
    #USER_CARS_PATH = '/cars';
    #USER_CARS_PATH_BY_ID_PATH = '/cars/#';
    #USER_CARS_BRANDS_PATH = '/cars/brands';
    #USER_CARS_BRANDS_BY_ID_PATH = '/cars/brands/#';
    #USER_CARS_MODELS_PATH = '/cars/models';
    #USER_CARS_MODELS_BY_ID_PATH = '/cars/models/#';

    constructor(options) {
        super(options)
    }

    async createCar(data){
        return this._client.post(this.#USER_CARS_PATH, data);
    }

    async getUserCars(){
        return this._client.get(this.#USER_CARS_PATH);
    }

    async getUserCarById(id){
        return this._client.get(this.#USER_CARS_PATH_BY_ID_PATH.replace('#', id));
    }

    async getUserCarBrands(){
        return this._client.get(this.#USER_CARS_BRANDS_PATH);
    }

    async getUserCarBrandById(id){
        return this._client.get(this.#USER_CARS_BRANDS_BY_ID_PATH);
    }

    async getUserCarModels(){
        return this._client.get(this.#USER_CARS_MODELS_PATH);
    }

    async getUserCarModelsById(id){
        return this._client.get(this.#USER_CARS_MODELS_BY_ID_PATH.replace('#', id));
    }

    async deleteCarById(id){
        return this._client.delete(this.#USER_CARS_PATH_BY_ID_PATH.replace('#', id));
    }

    async updateUserCar(id, data) {
        return this._client.put(this.#USER_CARS_PATH_BY_ID_PATH.replace('#', id), data);
    }
}