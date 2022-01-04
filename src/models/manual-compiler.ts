import { adResult, CategorizedAdResult } from "../interfaces/interfaces.js";
import Database from "./databse.js";
import Calculator from "./calculator.js";

export default class ManualCompiler{

    private database;
    private calculator;

    constructor(){
        this.database = new Database();
        this.calculator = new Calculator();
    }
    
    async compile(brandName: string){
        let collections = await this.database.getBrandAds(brandName);
        collections = this.adVariant(collections);
        this.calculator.addMinPrice(collections);
    }

    private adVariant(brandAds: CategorizedAdResult[]){
        const compiledBrandAds: any[] = []
        brandAds.forEach((subAds: CategorizedAdResult) => {
            const variants = this.adProdYearVariant(subAds);
            (subAds as any).variants = variants;
            compiledBrandAds.push(subAds);
        });
        return compiledBrandAds;
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