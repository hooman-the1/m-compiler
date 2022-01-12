import SingleCompiler from "../models/single-brand-compiler.js";
import AutoCompiler from "../models/auto-compiler.js";
export default class State {
    constructor() {
        this.singleCompiler = new SingleCompiler();
        this.autoCompiler = new AutoCompiler();
    }
    async runManualCompiler(brandName) {
        await this.singleCompiler.compile(brandName);
    }
    async runAutoCompile() {
        await this.autoCompiler.compile();
    }
}
