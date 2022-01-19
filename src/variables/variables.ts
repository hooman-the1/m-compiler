export default class Variables{
    public adsDBName = 'ads';
    public dbName = 'fch';

    private mongoUser = 'compiler';
    private mongoPassword = 'compiler';
    public mongoServer: string = 'mongodb://' + this.mongoUser + ':' + this.mongoPassword + '@localhost:27017/';
    
    public logFileLocation = '../logs/logs.txt';
    public precisionDigits = 3;
    public carsDBName = 'cars';

}