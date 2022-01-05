import { Variant, withVariants } from "../interfaces/interfaces";
import Variables from "../variables/variables.js";

export default class Calculator{

    private numberOfPrecisionDigits;
    private variables;

    constructor(){
        this.variables = new Variables();
        this.numberOfPrecisionDigits = this.variables.precisionDigits;
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
        let prices = this.removeOutlierPrices(variant.prices);
        let noOfAds = prices.length;
        let minPrice = this.calculateMinPriceToSpecifiedPrecision(prices);
        const keyValue = {
            'prodYear': variant.prodYear,
            'noOfAds': noOfAds,
            'minPrice': minPrice
        };
        return keyValue;
    }

    private calculateMinPriceToSpecifiedPrecision(prices: number[]): number{
        let minValue = eval(prices.join('+'))/prices.length;
        minValue = Number(minValue.toPrecision(this.numberOfPrecisionDigits))
        return minValue;
    }

    private removeOutlierPrices(prices: number[]): number[]{
        const size = prices.length;
        let q1, q3;

        if (size < 2) {
            return prices;
        }
    
        const sortedCollection = prices.slice().sort((a, b) => a - b);
    
        if ((size - 1) / 4 % 1 === 0 || size / 4 % 1 === 0) {
            q1 = 1 / 2 * (sortedCollection[Math.floor(size / 4) - 1] + sortedCollection[Math.floor(size / 4)]);
            q3 = 1 / 2 * (sortedCollection[Math.ceil(size * 3 / 4) - 1] + sortedCollection[Math.ceil(size * 3 / 4)]);
        } else {
            q1 = sortedCollection[Math.floor(size / 4)];
            q3 = sortedCollection[Math.floor(size * 3 / 4)];
        }
    
        const iqr = q3 - q1;
        const maxValue = q3 + iqr;
        const minValue = q1 - iqr;
        
        return sortedCollection.filter(value => (value <= maxValue) && (value >= minValue));
    }
} 