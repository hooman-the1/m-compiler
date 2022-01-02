import State from "./state/state";
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
