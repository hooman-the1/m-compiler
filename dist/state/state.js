import SingleCompiler from "../models/single-brand-compiler.js";
import AutoCompiler from "../models/auto-compiler.js";
export default class State {
    constructor() {
        this.singleCompiler = new SingleCompiler();
        this.autoCompiler = new AutoCompiler();
    }
    runManualCompiler(brandName) {
        this.singleCompiler.compile(brandName);
    }
    runAutoCompile() {
        this.autoCompiler.compile();
    }
}
