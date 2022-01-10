import State from "./state/state.js";
export default class Facade {
    constructor() {
        this.state = new State();
    }
    autoCompile() {
        this.state.runAutoCompile();
    }
    manualCompile(brandName) {
        this.state.runManualCompiler(brandName);
    }
}
