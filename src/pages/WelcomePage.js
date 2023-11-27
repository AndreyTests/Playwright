import BasePage from "./BasePage";

export default class WelcomePage extends BasePage {
    constructor(page) {
        super(page, '/', page.locator('button', {hasText: 'Guest log in'}));
        this.signUpBtn = this._page.locator('button:text("Sign up")');
        this.signInBtn = this._page.locator('button:text("Sign In")');
        this.modal = this._page.locator('.modal-open');
        this.userEmailInput = this._page.locator('#signinEmail');
        this.userPasswordInput = this._page.locator('#signinPassword');
        this.loginButton = this._page.locator('button:text("Login")')
    }
    async openSignUpModal(){
        await this.signUpBtn.click();
        await this.modal.waitFor();
    }

    async openSignInModal(){
        await this.signInBtn.click();
        await this.modal.waitFor();
    }

    async fillSignInModal(email, password) {
        await this.userEmailInput.fill(email);
        await this.userPasswordInput.fill(password);
    }

    async login() {
        await this.loginButton.click();
    }

}