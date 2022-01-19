import Variables from "../variables/variables.js";
import DB, { MongoClient } from 'mongodb';
import { initDBConnect } from "../interfaces/interfaces.js";
import Catch from "./catch.js";

export default class Database{

    protected variables;
    protected catch;
    protected carsDBName;
    private mongoServer: string; 
    private MongoClient;
    
    constructor(){
        this.variables = new Variables();
        this.carsDBName = this.variables.carsDBName;
        this.mongoServer = this.variables.mongoServer;
        this.MongoClient = DB.MongoClient;
        this.catch = new Catch();
    }

    private async createClient(dbName: string): Promise<MongoClient | undefined>{
        try{
            return await this.tryCreateClient(dbName);
        }catch(err: any){
            this.catch.deadCatch(err, 'some error in getting access to MongoClient! see log file for more information')
        }
    }

    private async tryCreateClient(dbName: string): Promise<MongoClient>{
        const mongoClient = new this.MongoClient!(this.mongoServer + dbName);
        await mongoClient.connect();
        return mongoClient;
    }

    protected async createConnect(dbName: string): Promise<initDBConnect | undefined>{
        try{
            return await this.tryCreateConnect(dbName);
        }catch(err: any){
            this.catch.deadCatch(err, 'some error in getting access to Database! see log file for more information')
        }
    }
    
    private async tryCreateConnect(dbName: string): Promise<initDBConnect>{
        const mongoClient = await this.createClient(dbName);
        const dbo = mongoClient!.db(dbName);
        return  {
            'client': mongoClient,
            'dbo': dbo
        }
    }

    protected async checkDatabase(dbName: string): Promise<void | undefined>{
        try{
            return await this.tryCheckDatabase(dbName);
        }catch(err: any){
            this.catch.deadCatch(err, "some error in getting data from Database! see log file for more information")
        }   
    }

    private async tryCheckDatabase(dbName: string): Promise<void>{
        const connect = await this.createConnect(dbName);
        const allCollections = await connect!.dbo.collections();
        if(allCollections.length == 0){
            throw new Error('the database is empty');
        }
        return;
    }



 
}