import Database from "./databse.js";
export default class ManualCompiler {
    constructor() {
        this.database = new Database();
    }
    async compile(brandName) {
        const ads = this.database.getBrandAds(brandName);
    }
}
