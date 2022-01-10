import State from "./state/state.js";

export default class Facade{

    private state;

    constructor(){
        this.state = new State();
    }

    autoCompile(){
        this.state.runAutoCompile();
    }

    manualCompile(brandName: string){
        this.state.runManualCompiler(brandName);
    }
}