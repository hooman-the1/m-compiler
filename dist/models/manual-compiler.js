import Database from "./databse.js";
export default class ManualCompiler {
    constructor() {
        this.database = new Database();
    }
    async compile(brandName) {
        const brandAds = await this.database.getBrandAds(brandName);
        const compiledBrandAds = [];
        brandAds.forEach((subAds) => {
            const variants = this.adProdYearVariant(subAds);
            subAds.variants = variants;
            compiledBrandAds.push(subAds);
        });
        console.log(compiledBrandAds[0].variants);
    }
    adProdYearVariant(subAds) {
        const prodYears = this.extractProdYear(subAds);
        const variants = this.extractPricesOfEachYear(subAds.ads, prodYears);
        return variants;
    }
    extractProdYear(subAds) {
        let prodYears = [];
        subAds.ads.forEach((ad) => {
            prodYears.push(ad.prodYear);
        });
        return prodYears.filter(function (value, index, array) {
            return array.indexOf(value) === index;
        });
    }
    pricesOfEachYearToVariant(subAds, prodYear) {
        const prices = [];
        subAds.forEach((ad) => {
            if (ad.prodYear == prodYear) {
                prices.push(ad.price);
            }
        });
        return ({
            'prodYear': prodYear,
            'prices': prices
        });
    }
    extractPricesOfEachYear(subAds, prodYears) {
        let variants = [];
        prodYears.forEach((prodYear) => {
            const variant = this.pricesOfEachYearToVariant(subAds, prodYear);
            variants.push(variant);
        });
        return variants;
    }
}
