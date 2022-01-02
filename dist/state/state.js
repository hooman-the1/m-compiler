import ManualCompiler from "../models/manual-compiler.js";
export default class State {
    constructor() {
        this.manualCompiler = new ManualCompiler();
    }
    runManualCompiler(brandName) {
        this.manualCompiler.compile(brandName);
    }
}
