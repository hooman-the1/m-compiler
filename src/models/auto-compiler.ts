import Fetch from "./database-Fetch.js";
import SingleCompiler from "./single-brand-compiler.js";

export default class AutoCompiler{

    private fetch;
    private singleCompiler;

    constructor(){
        this.fetch = new Fetch();
        this.singleCompiler = new SingleCompiler();
    }

    async compile(){
        let brandNames = await this.fetch.getAllBrandNames();
        for(let i = 0; i < brandNames.length; i++){
            await this.singleCompiler.compile(brandNames[i]);
        }
        return;
    }
}