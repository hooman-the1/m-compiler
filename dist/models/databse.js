import Variables from "../variables/variables.js";
import DB from 'mongodb';
import Logs from "./log-factory.js";
export default class Database {
    constructor() {
        this.variables = new Variables();
        this.dbName = this.variables.dbName;
        this.mongoServer = this.variables.mongoServer;
        this.adsDBName = this.variables.adsDBName;
        this.MongoClient = DB.MongoClient;
        this.log = new Logs();
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
            let subNameAds = await connect.dbo.collection(brandCollections[i]).find({}).toArray();
            let object = {
                'collection': brandCollections[i],
                'name': subNameAds[0].name,
                'subName': subNameAds[0].subName,
                'ads': subNameAds
            };
            ads.push(object);
        }
        connect.client.close();
        return ads;
    }
    async getBrandCollections(brandName) {
        try {
            const connect = await this.createConnect(this.adsDBName);
            await this.checkDatabase(this.adsDBName);
            const allCollections = await connect.dbo.collections();
            const brandCollections = await this.returnBrandCollectionsFromAllCollections(brandName, allCollections);
            connect.client.close();
            return brandCollections;
        }
        catch (err) {
            console.log("brand error");
            this.log.handleErrorLog(err);
            console.log('some error in getting collections! see log file for more information');
        }
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
        try {
            const mongoClient = new this.MongoClient(this.mongoServer + dbName);
            await mongoClient.connect();
            return mongoClient;
        }
        catch (err) {
            this.log.handleErrorLog(err);
            console.log('some error in getting access to MongoClient! see log file for more information');
            process.exit();
        }
    }
    async createConnect(dbName) {
        try {
            const mongoClient = await this.createClient(dbName);
            const dbo = mongoClient.db(dbName);
            return {
                'client': mongoClient,
                'dbo': dbo
            };
        }
        catch (err) {
            this.log.handleErrorLog(err);
            console.log('some error in getting access to Database! see log file for more information');
            process.exit();
        }
    }
    async checkDatabase(dbName) {
        const connect = await this.createConnect(this.adsDBName);
        try {
            const allCollections = await connect.dbo.collections();
            if (allCollections.length == 0) {
                throw new Error('the database is empty');
            }
            return;
        }
        catch (err) {
            this.log.handleErrorLog(err);
            console.log("some error in getting data from Database! see log file for more information");
            process.exit();
        }
    }
}
