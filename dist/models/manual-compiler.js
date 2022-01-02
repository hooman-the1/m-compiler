import Database from "./databse.js";
export default class ManualCompiler {
    constructor() {
        this.database = new Database();
    }
    async compile(brandName) {
        const ads = await this.database.getBrandAds(brandName);
        console.log(ads[0]);
        console.log(ads.length);
    }
}
