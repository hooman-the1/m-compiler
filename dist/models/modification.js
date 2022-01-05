import Calculations from "./calculations.js";
export default class Modification {
    constructor() {
        this.claculations = new Calculations();
    }
    addMinPrice(collections) {
        const ads = [];
        collections.forEach((collection) => {
            let newCollection = this.modifyCollectionVariants(collection);
            ads.push(newCollection);
        });
        return ads;
    }
    modifyCollectionVariants(collection) {
        let variants = [];
        collection.variants.forEach((variant) => {
            let variantKeyValue = this.createVariantsKeyValue(variant);
            variants.push(variantKeyValue);
        });
        collection.variants = variants;
        return collection;
    }
    createVariantsKeyValue(variant) {
        let prices = this.claculations.removeOutlierPrices(variant.prices);
        let noOfAds = prices.length;
        let minPrice = this.claculations.calculateMinPriceToSpecifiedPrecision(prices);
        const keyValue = {
            'prodYear': variant.prodYear,
            'noOfAds': noOfAds,
            'minPrice': minPrice
        };
        return keyValue;
    }
}
