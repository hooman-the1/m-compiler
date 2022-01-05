import Logs from "./log-factory.js";
export default class Catch {
    constructor() {
        this.logs = new Logs();
    }
    deadCatch(err, consoleMessage) {
        this.catchHandler(err, consoleMessage);
        process.exit();
    }
    aliveCatch(err, consoleMessage) {
        this.catchHandler(err, consoleMessage);
    }
    catchHandler(err, consoleMessage) {
        this.logs.handleErrorLog(err);
        console.log(consoleMessage);
    }
}
