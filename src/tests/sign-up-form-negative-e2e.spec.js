import { test, expect } from '@playwright/test';
import { SignUpModal } from "../pages/SignUpModal";

const redBorderColor = 'rgb(220, 53, 69)';
test.describe("Sign-up form validation", ()=> {
    let page;
    let signUpPage;

    test.beforeAll(async ({browser})=>{
        page = await browser.newPage();

        signUpPage = new SignUpModal(page);

        await signUpPage.navigate();
    });

    test.beforeEach(async () => {
        await signUpPage.openSignUpWindow();
    });

    test.afterEach(async () => {
        await signUpPage.closeSignUpWindow();
    });

    test("T-01 verify the name empty and red border", async ()=> {
        await signUpPage.userNameInput.click();
        await signUpPage.focusOutFromField();

        const firstErrorText = await signUpPage.getWarningNotification(0);

        const borderColor = await signUpPage.getFieldBorderColor(signUpPage.userNameInput);

        expect(firstErrorText).toStrictEqual('Name required');
        expect(borderColor).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
    });

    test("T-02 verify the name wrong data and length input", async ()=> {
        await signUpPage.fillInput(signUpPage.userNameInput, '1');
        await signUpPage.focusOutFromField();

        const firstErrorText = await signUpPage.getWarningNotification(0);
        const secondErrorText = await signUpPage.getWarningNotification(1);

        expect(firstErrorText).toStrictEqual('Name is invalid');
        expect(secondErrorText).toStrictEqual('Name has to be from 2 to 20 characters long');
    });

    test("T-03 verify the lastname wrong length input", async ()=> {
        await signUpPage.fillInput(signUpPage.userLastNameInput, 'B');
        await signUpPage.focusOutFromField();

        const firstErrorText = await signUpPage.getWarningNotification(0);

        expect(firstErrorText).toStrictEqual('Last name has to be from 2 to 20 characters long');
    });

    test("T-04 verify the email validation: wrong input data", async ()=> {
        await signUpPage.fillInput(signUpPage.userEmailInput, 'aqa-andriy.@mail.com');
        await signUpPage.focusOutFromField();

        const errorText = await signUpPage.getWarningNotification(0);

        expect(errorText).toStrictEqual('Email is incorrect');
    });

    test("T-05 verify the password wrong input data", async ()=> {
        await signUpPage.fillInput(signUpPage.userPasswordInput, '1234567');
        await signUpPage.focusOutFromField();

        const errorText = await signUpPage.getWarningNotification(0);

        expect(errorText).toStrictEqual('Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter');
    });

    test("T-06 verify the re-enter password: wrong input data", async ()=> {
        await signUpPage.fillInput(signUpPage.userPasswordInput, 'Ab12345678');
        await signUpPage.fillInput(signUpPage.userReEnterPasswordInput, 'Ac12345678');
        await signUpPage.focusOutFromField();

        const errorText = await signUpPage.getWarningNotification(0);

        expect(errorText).toStrictEqual('Passwords do not match');
    });
})