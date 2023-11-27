import {test as base, request} from "@playwright/test";
import {STORAGE_STATE_USER_PATH} from "../data/storageState";
import ProfilePage from "../pages/ProfilePage";
import GaragePage from "../pages/GaragePage";

export const test = base.extend({
        userProfilePage: async ({browser}, use) => {
            const contextData = await browser.newContext({
                storageState: STORAGE_STATE_USER_PATH
            });
            const page = await contextData.newPage();
            const profilePage = new ProfilePage(page);
            await profilePage.navigate();
            await use(profilePage);
        },
        garagePage: async ({browser}, use) => {
            const contextData = await browser.newContext({
                storageState: STORAGE_STATE_USER_PATH
            });
            const page = await contextData.newPage();
            const garagePage = new GaragePage(page);
            await garagePage.navigate();
            await use(garagePage);
        },
    userApiClient: async({}, use) => {
        const contextData = await request.newContext({
            storageState: STORAGE_STATE_USER_PATH
        });
        await use(contextData);
        await contextData.dispose();
        }
    }
)
