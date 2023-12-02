import {config} from "../../config/config.js";
import {CookieJar} from "tough-cookie";
import AuthController from "../controllers/AuthController.js";
import CarController from "../controllers/CarContoller.js";

export default class ApiClient {
    constructor(options) {
        this.auth = new AuthController(options);
        this.cars = new CarController(options);
    }

    static async authorize(userData, options= {baseUrl: config.apiURL}) {
        const jar = new CookieJar();
        const params = {... options, cookies: jar};
        const authController = new AuthController(params);
        await authController.signIn(userData);
        return new ApiClient(params);
    }
}