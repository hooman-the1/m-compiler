import Logs from "./log-factory.js";

export default class Catch{

    private logs;

    constructor(){
        this.logs = new Logs();
    }

    deadCatch(err: Error, consoleMessage: string){
        this.catchHandler(err, consoleMessage);
        process.exit();
    }

    aliveCatch(err: Error, consoleMessage: string){
        this.catchHandler(err, consoleMessage);
    }

    private catchHandler(err: Error, consoleMessage: string){
        this.logs.handleErrorLog(err);
        console.log(consoleMessage);
    }
} 