import { adFetch, Car, WithCategory } from "../interfaces/interfaces.js";
import Fetch from "./database-Fetch.js";
import Insert from "./database-insert.js";
import Modification from "./modification.js";

export default class ManualCompiler{

    private calculator;
    private fetch;
    private insert;

    constructor(){
        this.calculator = new Modification();
        this.fetch = new Fetch()
        this.insert = new Insert();
    }
    
    async compile(brandName: string): Promise<Car[]>{
        let collections = await this.fetch.getBrandAds(brandName);
        collections = this.adVariant(collections);
        let collectionsWithVariants = this.calculator.addMinPrice(collections);
        collectionsWithVariants = this.removeAdsDetails(collectionsWithVariants);
        await this.insert.insertCarsIntoDatabase(collectionsWithVariants);
        // console.log(collectionsWithVariants[0]);
        return collectionsWithVariants;
    }

    private removeAdsDetails(collections: any[]){
        const resultCollections: any[] = []
        collections.forEach(collection => {
            delete collection.ads;
            resultCollections.push(collection);
        });
        return resultCollections;
    }

    private adVariant(brandAds: WithCategory[]){
        const compiledBrandAds: any[] = []
        brandAds.forEach((subAds: WithCategory) => {
            const variants = this.adProdYearVariant(subAds);
            (subAds as any).variants = variants;
            compiledBrandAds.push(subAds);
        });
        return compiledBrandAds;
    }

    

    private adProdYearVariant(subAds: WithCategory){
        const prodYears = this.extractProdYear(subAds);
        const variants = this.extractPricesOfEachYear(subAds.ads, prodYears);
        return variants;
    }

    private extractProdYear(subAds: WithCategory): string[]{
        let prodYears: string[] = [];
        subAds.ads.forEach((ad: adFetch) => {
            prodYears.push(ad.prodYear);
        });
        return prodYears.filter(function (value, index, array) { 
            return array.indexOf(value) === index;
        });
    }
    
    private pricesOfEachYearToVariant(subAds: adFetch[], prodYear: string){
        const prices: number[] = [];
        subAds.forEach((ad: adFetch) => {
            if(ad.prodYear == prodYear){
                prices.push(ad.price);
            }
        })
        return ({
            'prodYear': prodYear,
            'prices': prices
        })
    }

    private extractPricesOfEachYear(subAds: adFetch[], prodYears: string[]){
        let variants: any[] = [];
        prodYears.forEach((prodYear: string) => {
            const variant = this.pricesOfEachYearToVariant(subAds, prodYear);
            variants.push(variant);
        });
        return variants;
    }

    
} 