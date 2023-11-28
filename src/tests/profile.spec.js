import {test} from '../fixtures/test.fixtures'
import {expect} from "@playwright/test";
import {brands, CUSTOM_BRANDS_RESPONSE_BODY} from "./fixtures/brands";
import {CUSTOM_MODELS_RESPONSE_BODY} from "./fixtures/models";
import {CUSTOM_PROFILE_RESPONSE_BODY, customProfile} from "./fixtures/profile";
test.describe('User profile', ()=>{
    test('page should contain valid user info', async ({userProfilePage})=>{
        await expect(userProfilePage.userName, "valid user name should be displayed")
            .toHaveText(`AqaAndriy AqaLastName`);
    });
    /* FIRST TASK IMPLEMENTATION */
    test("Check MOCKED request for profile", async ({ userProfilePage }) => {
        const { page } = userProfilePage;

        await page.route('/api/users/profile', route => {
            route.fulfill({body: JSON.stringify(CUSTOM_PROFILE_RESPONSE_BODY)})
        });

        await userProfilePage.page.reload();

        await userProfilePage.userName.waitFor();

        expect(await userProfilePage.userName.innerText())
            .toEqual(`${customProfile.name} ${customProfile.lastName}`);
    });
});