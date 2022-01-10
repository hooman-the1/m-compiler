import SingleCompiler from "../models/single-brand-compiler.js";
import AutoCompiler from "../models/auto-compiler.js";

export default class State{

    private singleCompiler;
    private autoCompiler;

    constructor(){
        this.singleCompiler = new SingleCompiler();
        this.autoCompiler = new AutoCompiler();
    }

    runManualCompiler(brandName: string){
        this.singleCompiler.compile(brandName);
    }

    runAutoCompile(){
        this.autoCompiler.compile();
    }
}