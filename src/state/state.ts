import ManualCompiler from "../models/manual-compiler.js";

export default class State{

    private manualCompiler;

    constructor(){
        this.manualCompiler = new ManualCompiler();
    }

    runManualCompiler(brandName: string){
        this.manualCompiler.compile(brandName);
    }
}