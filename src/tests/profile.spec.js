import {test} from '../fixtures/test.fixtures'
import {expect} from "@playwright/test";
test.describe('User profile', ()=>{
    test('page should contain valid user info', async ({userProfilePage})=>{
        await userProfilePage.navigate();
        await expect(userProfilePage.userName, "valid user name should be displayed")
            .toHaveText(`AqaAndriy AqaLastName`);
    });
});