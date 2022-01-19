import Fetch from "./database-Fetch.js";
import Insert from "./database-insert.js";
import Modification from "./modification.js";
export default class SingleCompiler {
    constructor() {
        this.calculator = new Modification();
        this.fetch = new Fetch();
        this.insert = new Insert();
    }
    async compile(brandName) {
        let collections = await this.fetch.getBrandAds(brandName);
        collections = this.adVariant(collections);
        let brandCollectionsWithVariants = this.calculator.addMinPrice(collections);
        brandCollectionsWithVariants = this.removeAdsDetails(brandCollectionsWithVariants);
        await this.insert.insertCarsIntoDatabaseTmp(brandCollectionsWithVariants);
        console.log(`${brandName} compile done!`);
        return;
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
    removeAdsDetails(collections) {
        const resultCollections = [];
        collections.forEach(collection => {
            delete collection.ads;
            resultCollections.push(collection);
        });
        return resultCollections;
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
    extractPricesOfEachYear(subAds, prodYears) {
        let variants = [];
        prodYears.forEach((prodYear) => {
            const variant = this.pricesOfEachYearToVariant(subAds, prodYear);
            variants.push(variant);
        });
        return variants;
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
}
