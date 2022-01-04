import Variables from "../variables/variables.js";
import DB, { MongoClient } from 'mongodb';
import { initDBConnect, CategorizedAdResult } from "../interfaces/interfaces.js";
import Logs from "./log-factory.js";

export default class Database{

    private variables;
    private dbName: string;
    private mongoServer: string; 
    private adsDBName: string;
    private MongoClient;
    private log;

    constructor(){
        this.variables = new Variables();
        this.dbName = this.variables.dbName;
        this.mongoServer = this.variables.mongoServer;
        this.adsDBName = this.variables.adsDBName;
        this.MongoClient = DB.MongoClient;
        this.log = new Logs();
    }

    async getBrandAds(brandName: string): Promise<CategorizedAdResult[]>{
        const brandCollections  = await this.getBrandCollections(brandName);
        const ads = await this.getAds(brandCollections!);
        return ads;
    }

    private async getAds(brandCollections: string[]): Promise<CategorizedAdResult[]>{
        const connect = await this.createConnect(this.adsDBName);
        let ads: any[] = []
        for(let i = 0; i < brandCollections.length; i ++ ){
            let subNameAds = await connect!.dbo.collection(brandCollections[i]).find({}).toArray();
            let object = {
                'collection': brandCollections[i],
                'name': subNameAds[0].name,
                'subName': subNameAds[0].subName,
                'ads': subNameAds
            }
            
            ads.push(object);
        }
        connect!.client.close();
        return ads;
    }

    private async getBrandCollections(brandName: string): Promise<string[] | undefined>{
            const connect = await this.createConnect(this.adsDBName);
            await this.checkDatabase(this.adsDBName);
            const allCollections: any[] = await connect!.dbo.collections();
            const brandCollections = await this.returnBrandCollectionsFromAllCollections(brandName, allCollections);
            connect!.client.close();
            return brandCollections;
    }

    private async returnBrandCollectionsFromAllCollections(brandName: string, allCollections: any[]): Promise<string[]>{
        const brandCollections: string[] = [];
        for(let i = 0; i < allCollections.length; i ++){
            const collectionName = allCollections[i].namespace.replace(this.adsDBName + '.','');
            if(collectionName.replace(/[0-9]/g, '').includes(brandName)){
                brandCollections.push(collectionName);
            }
        }
        return brandCollections;
    }

    private async createClient(dbName: string): Promise<MongoClient | undefined>{
        try{
            const mongoClient = new this.MongoClient!(this.mongoServer + dbName);
            await mongoClient.connect();
            return mongoClient;
        }catch(err: any){
            this.log.handleErrorLog(err);
            console.log('some error in getting access to MongoClient! see log file for more information');
            process.exit();
        }
    }

    private async createConnect(dbName: string): Promise<initDBConnect | undefined>{
        try{
            const mongoClient = await this.createClient(dbName);
            const dbo = mongoClient!.db(dbName);
            return  {
                'client': mongoClient,
                'dbo': dbo
            }
        }catch(err: any){
            this.log.handleErrorLog(err);
            console.log('some error in getting access to Database! see log file for more information');
            process.exit();
        }
    }

    private async checkDatabase(dbName: string){
        const connect = await this.createConnect(this.adsDBName);
        try{
            const allCollections = await connect!.dbo.collections();
            if(allCollections.length == 0){
                throw new Error('the database is empty');
            }
            return;
        }catch(err: any){
            this.log.handleErrorLog(err);
            console.log("some error in getting data from Database! see log file for more information")
            process.exit();
        }
        
    }


}