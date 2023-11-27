import {test} from "@playwright/test";
import {USER} from "../data/users";
import {STORAGE_STATE_USER_PATH} from "../data/storageState";
import WelcomePage from "../pages/WelcomePage";

test("Login as user and save storage state", async ({page, context})=>{
    const welcomePage = new WelcomePage(page);
    await welcomePage.navigate();
    await welcomePage.openSignInModal();
    await welcomePage.fillSignInModal(USER.email, USER.password);
    await welcomePage.login();
    await page.waitForURL('panel/garage');
    await context.storageState({
        path: STORAGE_STATE_USER_PATH
    });

    console.log('the login is done and auth state is saved')
})