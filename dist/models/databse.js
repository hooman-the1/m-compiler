import Variables from "../variables/variables.js";
import DB from 'mongodb';
export default class Database {
    constructor() {
        this.variables = new Variables();
        this.dbName = this.variables.dbName;
        this.mongoServer = this.variables.mongoServer;
        this.adsDBName = this.variables.adsDBName;
        this.MongoClient = DB.MongoClient;
    }
    async getBrandAds(brandName) {
        const connect = await this.createConnect(this.adsDBName);
        const ads = await connect.dbo.collection(brandName + '1').find({}).toArray();
        console.log(ads);
        connect.client.close();
    }
    async createClient(dbName) {
        const mongoClient = new this.MongoClient(this.mongoServer + dbName);
        mongoClient.connect();
        return mongoClient;
    }
    async createConnect(dbName) {
        const mongoClient = await this.createClient(dbName);
        const dbo = mongoClient.db(dbName);
        return {
            'client': mongoClient,
            'dbo': dbo
        };
    }
}
