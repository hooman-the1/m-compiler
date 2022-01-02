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
        const brandCollections = await this.getBrandCollections(brandName);
        const ads = await this.getAds(brandCollections);
        return ads;
    }
    async getAds(brandCollections) {
        const connect = await this.createConnect(this.adsDBName);
        let ads = [];
        for (let i = 0; i < brandCollections.length; i++) {
            ads = ads.concat(await connect.dbo.collection(brandCollections[i]).find({}).toArray());
        }
        connect.client.close();
        return ads;
    }
    async getBrandCollections(brandName) {
        const connect = await this.createConnect(this.adsDBName);
        const allCollections = await connect.dbo.collections();
        const brandCollections = await this.returnBrandCollectionsFromAllCollections(brandName, allCollections);
        connect.client.close();
        return brandCollections;
    }
    async returnBrandCollectionsFromAllCollections(brandName, allCollections) {
        const brandCollections = [];
        for (let i = 0; i < allCollections.length; i++) {
            const collectionName = allCollections[i].namespace.replace(this.adsDBName + '.', '');
            if (collectionName.replace(/[0-9]/g, '').includes(brandName)) {
                brandCollections.push(collectionName);
            }
        }
        return brandCollections;
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
