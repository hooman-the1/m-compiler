import Database from "./databse.js";

export default class ManualCompiler{

    private database;

    constructor(){
        this.database = new Database();
    }
    
    async compile(brandName: string){
        const ads = await this.database.getBrandAds(brandName);
        console.log(ads[0]);    
        console.log(ads.length);    
    }
} 