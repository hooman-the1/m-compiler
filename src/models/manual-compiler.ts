import { adResult, CategorizedAdResult } from "../interfaces/interfaces.js";
import Database from "./databse.js";

export default class ManualCompiler{

    private database;

    constructor(){
        this.database = new Database();
    }
    
    async compile(brandName: string){
        const brandAds = await this.database.getBrandAds(brandName);
        const compiledBrandAds: any = []
        brandAds.forEach((subAds: CategorizedAdResult) => {
            const variants = this.adProdYearVariant(subAds);
            (subAds as any).variants = variants;
            compiledBrandAds.push(subAds);
        });
        console.log(compiledBrandAds[0].variants);
    }

    private adProdYearVariant(subAds: CategorizedAdResult){
        const prodYears = this.extractProdYear(subAds);
        const variants = this.extractPricesOfEachYear(subAds.ads, prodYears);
        return variants;
    }

    private extractProdYear(subAds: CategorizedAdResult): string[]{
        let prodYears: string[] = [];
        subAds.ads.forEach((ad: adResult) => {
            prodYears.push(ad.prodYear);
        });
        return prodYears.filter(function (value, index, array) { 
            return array.indexOf(value) === index;
        });
    }
    
    private pricesOfEachYearToVariant(subAds: adResult[], prodYear: string){
        const prices: number[] = [];
        subAds.forEach((ad: adResult) => {
            if(ad.prodYear == prodYear){
                prices.push(ad.price);
            }
        })
        return ({
            'prodYear': prodYear,
            'prices': prices
        })
    }

    private extractPricesOfEachYear(subAds: adResult[], prodYears: string[]){
        let variants: any[] = [];
        prodYears.forEach((prodYear: string) => {
            const variant = this.pricesOfEachYearToVariant(subAds, prodYear);
            variants.push(variant);
        });
        return variants;
    }

    
} 