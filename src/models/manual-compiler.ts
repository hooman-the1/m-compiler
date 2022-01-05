import { adFetch, WithCategory } from "../interfaces/interfaces.js";
import Database from "./databse.js";
import Modification from "./modification.js";

export default class ManualCompiler{

    private database;
    private calculator;

    constructor(){
        this.database = new Database();
        this.calculator = new Modification();
    }
    
    async compile(brandName: string){
        let collections = await this.database.getBrandAds(brandName);
        collections = this.adVariant(collections);
        let collectionsWithVariants = this.calculator.addMinPrice(collections);
        collectionsWithVariants = this.removeAdsDetails(collectionsWithVariants);
        console.log(collectionsWithVariants[16]);
        console.log(collectionsWithVariants[17]);
        console.log(collectionsWithVariants[18]);
        console.log(collectionsWithVariants[19]);
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