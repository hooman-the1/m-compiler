import Variables from "../variables/variables.js";
import DB from 'mongodb';
import { initDBConnect } from "../interfaces/interfaces.js";

export default class Database{

    private variables;
    private dbName: string;
    private mongoServer: string; 
    private adsDBName: string;
    private MongoClient;

    constructor(){
        this.variables = new Variables();
        this.dbName = this.variables.dbName;
        this.mongoServer = this.variables.mongoServer;
        this.adsDBName = this.variables.adsDBName;
        this.MongoClient = DB.MongoClient;
    }

    async getBrandAds(brandName: string){
        const connect = await this.createConnect(this.adsDBName);
        const ads = await connect.dbo.collection(brandName+'1').find({}).toArray();
        console.log(ads);
        connect.client.close();
    }

    private async createClient(dbName: string){
        const mongoClient = new this.MongoClient(this.mongoServer + dbName);
        mongoClient.connect();
        return mongoClient;
    }

    private async createConnect(dbName: string): Promise<initDBConnect>{
        const mongoClient = await this.createClient(dbName);
        const dbo = mongoClient.db(dbName);
        return {
            'client': mongoClient,
            'dbo': dbo
        }
    }


}