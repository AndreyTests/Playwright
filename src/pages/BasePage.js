export default class BasePage {
    constructor(page, url) {
        this._url = url
        this._page = page
    }
    get page() {
        return this._page;
    }

    async navigate(){
        await this._page.goto(this._url)
    }

    async getMainTitle() {
        return await this._page.title();
    }

    async getPageUrl() {
        return await this._page.url();
    }
}