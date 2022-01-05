import Database from "./databse.js";
import Calculator from "./calculator.js";
export default class ManualCompiler {
    constructor() {
        this.database = new Database();
        this.calculator = new Calculator();
    }
    async compile(brandName) {
        let collections = await this.database.getBrandAds(brandName);
        collections = this.adVariant(collections);
        let collectionsWithVariants = this.calculator.addMinPrice(collections);
        collectionsWithVariants = this.removeAdsDetails(collectionsWithVariants);
        console.log(collectionsWithVariants[3]);
        return 1;
    }
    removeAdsDetails(collections) {
        const resultCollections = [];
        collections.forEach(collection => {
            delete collection.ads;
            resultCollections.push(collection);
        });
        return resultCollections;
    }
    adVariant(brandAds) {
        const compiledBrandAds = [];
        brandAds.forEach((subAds) => {
            const variants = this.adProdYearVariant(subAds);
            subAds.variants = variants;
            compiledBrandAds.push(subAds);
        });
        return compiledBrandAds;
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
