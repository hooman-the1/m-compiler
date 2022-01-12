import State from "./state/state.js";

export default class Facade{

    private state;

    constructor(){
        this.state = new State();
    }

    async autoCompile(){
        await this.state.runAutoCompile();
        process.exit();
    }
    
    async manualCompile(brandName: string){
        await this.state.runManualCompiler(brandName);
        process.exit();
    }
}