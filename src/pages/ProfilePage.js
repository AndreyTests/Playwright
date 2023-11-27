import BasePage from "./BasePage.js";
export default class ProfilePage extends BasePage {
    constructor(page) {
        super(page, '/panel/profile', page.locator('button', {hasText: 'Edit profile'}));
        this.userName = this._page.locator('p.profile_name');
        this.editProfileBtn = this._page.locator('button', {hasText: 'Edit profile'});
        this.editProfileName = this._page.locator('#editProfileName');
        this.editProfileLastName = this._page.locator('#editProfileLastName');
        this.editProfileCountry = this._page.locator('#editProfileCountry');
        this.editProfileBirthday = this._page.locator('#editProfileDateBirth');
        this.saveProfileBtn = this._page.locator('button', {hasText: 'Save'});
    }
}