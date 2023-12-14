
import dotenv from 'dotenv'

dotenv.config({
    path:  process.env.ENV ? `./.env.${process.env.ENV}` : '../.env'
});

console.log("Using env : ", process.env.ENV);

export const config = {
    baseURL: process.env.BASE_URL,
    apiURL: process.env.API_URL,
    httpCredentials: {
        username: process.env.HTTP_CREDENTIALS_USER_NAME,
        password: process.env.HTTP_CREDENTIALS_PASSWORD
    }
}
