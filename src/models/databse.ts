import Variables from "../variables/variables.js";
import DB, { MongoClient } from 'mongodb';
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
        const brandCollections  = await this.getBrandCollections(brandName);
        const ads = await this.getAds(brandCollections);
    }

    private async getAds(brandCollections: string[]){
        console.log(brandCollections);
    }

    private async getBrandCollections(brandName: string): Promise<string[]>{
        const connect = await this.createConnect(this.adsDBName);
        const allCollections: any[] = await connect.dbo.collections();
        const brandCollections = await this.returnBrandCollectionsFromAllCollections(brandName, allCollections);
        connect.client.close();
        return brandCollections;
    }

    private async returnBrandCollectionsFromAllCollections(brandName: string, allCollections: string[]): Promise<string[]>{
        const brandCollections: string[] = [];
        allCollections.forEach((element: any) => {
            const collectionName = element.namespace.replace(this.adsDBName + '.','');
            if(collectionName.replace(/[0-9]/g, '').includes(brandName)){
                brandCollections.push(collectionName);
            }
        });
        return brandCollections;
    }

    private async createClient(dbName: string): Promise<MongoClient>{
        const mongoClient = new this.MongoClient(this.mongoServer + dbName);
        mongoClient.connect();
        return mongoClient;
    }

    private async createConnect(dbName: string): Promise<initDBConnect>{
        const mongoClient = await this.createClient(dbName);
        const dbo = mongoClient.db(dbName);
       return  {
            'client': mongoClient,
            'dbo': dbo
        }
    }


}