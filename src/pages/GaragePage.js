import BasePage from "./BasePage.js";

export default class GaragePage extends BasePage {
    constructor(page) {
        super(page, '/panel/garage', page.locator('app-panel-layout' ,
            {has : page.locator('button', {hasText: 'Add car'})}));

        this.addCarBtn = this._page.locator('button', {hasText: 'Add car'});
        this.carBrandsField = this._page.locator('#addCarBrand');
        this.carModelsField = this._page.locator('#addCarModel');
    }

    async getValues(element) {
        const data = await element.innerText();
        const results = data.split('\n').map(value => value.trim());
        return results.filter(el => el);
    }
}