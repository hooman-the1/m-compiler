import { adFetch, Car, WithCategory } from "../interfaces/interfaces.js";
import Fetch from "./database-Fetch.js";
import Insert from "./database-insert.js";
import Modification from "./modification.js";

export default class SingleCompiler{

    private calculator;
    private fetch;
    private insert;

    constructor(){
        this.calculator = new Modification();
        this.fetch = new Fetch()
        this.insert = new Insert();
    }
    
    async compile(brandName: string): Promise<void>{
        let collections = await this.fetch.getBrandAds(brandName);
        collections = this.adVariant(collections);
        let brandCollectionsWithVariants = this.calculator.addMinPrice(collections);
        brandCollectionsWithVariants = this.removeAdsDetails(brandCollectionsWithVariants);
        await this.insert.insertCarsIntoDatabaseTmp(brandCollectionsWithVariants);
        console.log(`${brandName} compile done!`);
        return; 
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

    private removeAdsDetails(collections: any[]){
        const resultCollections: any[] = []
        collections.forEach(collection => {
            delete collection.ads;
            resultCollections.push(collection);
        });
        return resultCollections;
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
    
    private extractPricesOfEachYear(subAds: adFetch[], prodYears: string[]){
        let variants: any[] = [];
        prodYears.forEach((prodYear: string) => {
            const variant = this.pricesOfEachYearToVariant(subAds, prodYear);
            variants.push(variant);
        });
        return variants;
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
} 