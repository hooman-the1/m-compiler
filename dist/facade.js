import State from "./state/state.js";
export default class Facade {
    constructor() {
        this.state = new State();
    }
    autoCompile() {
    }
    manualCompile(brandName) {
        this.state.runManualCompiler(brandName);
    }
}
