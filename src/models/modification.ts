import { Variant, withVariants } from "../interfaces/interfaces";
import Calculations from "./calculations.js";

export default class Modification{

    private claculations;

    constructor(){
        this.claculations = new Calculations();
    }

    addMinPrice(collections: any): withVariants[]{
        const ads: withVariants[] = []; 
        collections.forEach((collection: any) => {
            let newCollection = this.modifyCollectionVariants(collection);
            ads.push(newCollection);
        });
        return ads;
    }

    private modifyCollectionVariants(collection: any){
        let variants: Variant[] = [];
        collection.variants.forEach((variant: any) => {
            let variantKeyValue = this.createVariantsKeyValue(variant);
            variants.push(variantKeyValue);
        });
        collection.variants = variants;
        return collection;
    }

    private createVariantsKeyValue(variant: any){
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