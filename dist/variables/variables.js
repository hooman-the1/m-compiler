export default class Variables {
    constructor() {
        this.adsDBName = 'ads';
        this.dbName = 'fch';
        this.mongoUser = 'compiler';
        this.mongoPassword = 'compiler';
        this.mongoServer = 'mongodb://' + this.mongoUser + ':' + this.mongoPassword + '@localhost:27017/';
        this.logFileLocation = '../logs/logs.txt';
        this.precisionDigits = 3;
        this.carsDBName = 'cars';
    }
}
