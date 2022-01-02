import Database from "./databse.js";

export default class ManualCompiler{

    private database;

    constructor(){
        this.database = new Database();
    }
    
    async compile(brandName: string){
        const ads = this.database.getBrandAds(brandName);    
    }
} 