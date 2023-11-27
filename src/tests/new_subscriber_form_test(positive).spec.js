import { test, expect } from '@playwright/test';
test.describe("Sign Up form positive testing @positive", ()=> {
    test.beforeEach(async ({page}) => {
        await page.goto('/');
        //click on sign up
        await page.locator('.hero-descriptor_btn.btn.btn-primary').click();
    });

    test("verify the user is created", async ({page}) => {
        const randomNumber = Math.round(Math.random() * 400);

        const userNameInput = page.locator('#signupName');
        await userNameInput.click();
        await userNameInput.fill('Andriy');

        const userLastNameInput = page.locator('#signupLastName');
        await userLastNameInput.click();
        await userLastNameInput.fill('Chuguy');

        const userEmailInput = page.locator('#signupEmail');
        await userEmailInput.click();
        await userEmailInput.fill(`aqa-${randomNumber}andriy@gmail.com.ua`);

        const userPasswordInput = page.locator('#signupPassword');
        await userPasswordInput.click();
        await userPasswordInput.fill('Ab12345678');

        const userReEnterPasswordInput = page.locator('#signupRepeatPassword');
        await userReEnterPasswordInput.click();
        await userReEnterPasswordInput.fill('Ab12345678');

        const registrationButton = page.locator('.modal-footer .btn-primary');

        expect(await registrationButton.isDisabled()).toBe(false);

        await registrationButton.click();
        const garagePageTitle = await page.locator('.panel-page');
        await page.waitForTimeout(1000);
        await garagePageTitle.waitFor();

        expect(await garagePageTitle.isVisible()).toBe(true);
    });
})
