import fs from 'fs';
import Variables from '../variables/variables.js';

export default class Logs{

    private variables;

    constructor(){
        this.variables = new Variables();
    }

    async handleErrorLog(err: any){
        var file = fs.appendFileSync(this.variables.logFileLocation,
            '\n' 
            + 'error name : ' + err.name 
            + '\n' 
            + 'error message : ' + err.message 
            + '\n' 
            + 'error time : ' + new Date() 
            + '\n' 
            + 'error stack : ' + err.stack
            + '\n' + '------------------------');
        
        }
}