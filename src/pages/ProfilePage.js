import BasePage from "./BasePage.js";
export default class ProfilePage extends BasePage {
    constructor(page) {
        super(page, '/panel/profile', page.locator('button', {hasText: 'Edit profile'}));
        this.userName = this._page.locator('.profile_name');
    }
}