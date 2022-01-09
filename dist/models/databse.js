import Variables from "../variables/variables.js";
import DB from 'mongodb';
import Catch from "./catch.js";
export default class Database {
    constructor() {
        this.variables = new Variables();
        this.carsDBName = this.variables.carsDBName;
        this.mongoServer = this.variables.mongoServer;
        this.MongoClient = DB.MongoClient;
        this.catch = new Catch();
    }
    async createClient(dbName) {
        try {
            return await this.tryCreateClient(dbName);
        }
        catch (err) {
            this.catch.deadCatch(err, 'some error in getting access to MongoClient! see log file for more information');
        }
    }
    async tryCreateClient(dbName) {
        const mongoClient = new this.MongoClient(this.mongoServer + dbName);
        await mongoClient.connect();
        return mongoClient;
    }
    async createConnect(dbName) {
        try {
            return await this.tryCreateConnect(dbName);
        }
        catch (err) {
            this.catch.deadCatch(err, 'some error in getting access to Database! see log file for more information');
        }
    }
    async tryCreateConnect(dbName) {
        const mongoClient = await this.createClient(dbName);
        const dbo = mongoClient.db(dbName);
        return {
            'client': mongoClient,
            'dbo': dbo
        };
    }
    async checkDatabase(dbName) {
        try {
            return await this.tryCheckDatabase(dbName);
        }
        catch (err) {
            this.catch.deadCatch(err, "some error in getting data from Database! see log file for more information");
        }
    }
    async tryCheckDatabase(dbName) {
        const connect = await this.createConnect(dbName);
        const allCollections = await connect.dbo.collections();
        if (allCollections.length == 0) {
            throw new Error('the database is empty');
        }
        return;
    }
}
