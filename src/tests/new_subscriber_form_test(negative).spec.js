

import { test, expect } from '@playwright/test';

test.describe("Sign-up form validation @negative", ()=> {
    test.beforeEach(async ({page}) => {
        await page.goto('/');
        //click on sign up
        await page.locator('.hero-descriptor_btn.btn.btn-primary').click();
    });

    test("T-01 verify the name validation: empty and red border", async ({page})=> {
        const userNameInput = page.locator('#signupName');
        await userNameInput.click();
        //focus out from the field
        await page.locator('.modal-footer').click();

        const nameWarningsPanel = page.locator('div.invalid-feedback');
        await nameWarningsPanel.isVisible();

        const firstErrorText = await page.locator('div.invalid-feedback p')
            .nth(0).innerText();

        const borderColor = await userNameInput.evaluate((el) => {
            const style = window.getComputedStyle(el);
            return style.getPropertyValue("border-color");
        });

        expect(firstErrorText).toStrictEqual('Name required');
        expect(borderColor).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
    });

    test("T-02 verify the name validation: wrong data and length input", async ({page})=> {
        const userNameInput = page.locator('#signupName');
        await userNameInput.click();
        await userNameInput.fill('1');
        //focus out from the field
        await page.locator('.modal-title').click();

        const nameWarningsPanel = page.locator('div.invalid-feedback');
        await nameWarningsPanel.isVisible();

        const firstErrorText = await page.locator('div.invalid-feedback p')
            .nth(0).innerText();
        const secondErrorText = await page.locator('div.invalid-feedback p')
            .nth(1).innerText();


        expect(firstErrorText).toStrictEqual('Name is invalid');
        expect(secondErrorText).toStrictEqual('Name has to be from 2 to 20 characters long');

    });

    test("T-03 verify the last name validation: wrong length input",
        async ({page})=> {
            const userLastNameInput = page.locator('#signupLastName');
            await userLastNameInput.click();
            await userLastNameInput.fill('B');
            //focus out from the field
            await page.locator('.modal-footer').click();

            const lastNameWarningsPanel = page.locator('div.invalid-feedback');
            await lastNameWarningsPanel.isVisible();

            const firstErrorText = await page.locator('.invalid-feedback').innerText();

            expect(firstErrorText).toStrictEqual('Last name has to be from 2 to 20 characters long');
        });

    test("T-04 verify the email validation: wrong input data", async ({page})=> {
        const userEmailInput = page.locator('#signupEmail');
        await userEmailInput.click();
        await userEmailInput.fill('aqa-andriy.@mail.com');
        //focus out from the field
        await page.locator('.modal-footer').click();

        const emailWarningsPanel = page.locator('div.invalid-feedback');
        await emailWarningsPanel.isVisible();

        const errorText = await page.locator('div.invalid-feedback').innerText();

        expect(errorText).toStrictEqual('Email is incorrect');
    });

    test("T-05 verify the password validation: wrong input data", async ({page})=> {
        const userPasswordInput = page.locator('#signupPassword');
        await userPasswordInput.click();
        await userPasswordInput.fill('12345678');
        //focus out from the field
        await page.locator('.modal-footer').click();

        const emailWarningsPanel = page.locator('div.invalid-feedback');
        await emailWarningsPanel.isVisible();

        const errorText = await page.locator('.invalid-feedback').innerText();

        expect(errorText).toStrictEqual('Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter');

    });

    test("T-06 verify the re-enter password validation: wrong input data", async ({page})=> {
        const userPasswordInput = page.locator('#signupPassword');
        await userPasswordInput.click();
        await userPasswordInput.fill('Ab12345678');

        const userRepeatPasswordInput = page.locator('#signupRepeatPassword');
        await userRepeatPasswordInput.click();
        await userRepeatPasswordInput.fill('Ac12345678');
        //focus out from the field
        await page.locator('.modal-footer').click();

        const emailWarningsPanel = page.locator('div.invalid-feedback');
        await emailWarningsPanel.isVisible();

        const errorText = await page.locator('.invalid-feedback').innerText();

        expect(errorText).toStrictEqual('Passwords do not match');

    });

    test.afterEach(async ({page})=>{
        //close the form
        await page.locator('button.close').click();
    });
})