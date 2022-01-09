import Variables from "../variables/variables.js";
import DB, { MongoClient } from 'mongodb';
import { Car, initDBConnect, WithCategory } from "../interfaces/interfaces.js";
import Catch from "./catch.js";

export default class Database{

    private variables;
    private dbName: string;
    private mongoServer: string; 
    private adsDBName: string;
    private MongoClient;
    private catch;
    private carsDBName;

    private carsSchema = {
        bsonType: "object", 
        required: ["_id", "name", "subName", "collectionName", "variants"],
        properties: {
            _id: {
                bsonType: "objectId"
            },
            name: {
                bsonType: "string",
                description: "main name of car"
            },
            subName: {
                bsonType: "string",
                description: "sub name of car"
            },
            collectionName: {
                bsonType: "string",
                description: "collection name in ads database"
            },
            variants: {
                bsonType: "array",
                description: "prod years variants array",
                minItems: 1,
                items: {
                    bsonType: "object"
                }
            } 
        }
    }
    
    constructor(){
        this.variables = new Variables();
        this.dbName = this.variables.dbName;
        this.carsDBName = this.variables.carsDBName;
        this.mongoServer = this.variables.mongoServer;
        this.adsDBName = this.variables.adsDBName;
        this.MongoClient = DB.MongoClient;
        this.catch = new Catch();
    }
    
    async insertCarsIntoDatabase(cars: Car[]){
        const connect = await this.createConnect(this.carsDBName);
        await this.createCollections(connect!.dbo, cars);
        await this.insertCars(connect!.dbo, cars)
        connect?.client.close();
    }

    private async insertCars(dbo: any, cars: Car[]){
        for(let i = 0; i < cars.length; i++){
            await this.insertCar(dbo, cars[i]);
        }
        return;
    }

    private async insertCar(dbo: any, car: Car){
        try{
            await this.tryInsert(dbo,car);
        }catch(err: any){
            this.catch.aliveCatch(err, `some error in insert ${car.name} ${car.subName} record in ${car.collectionName} collection! see log file for more information`)
        }
        return;
    }

    private async tryInsert(dbo: any, car: Car){
        await dbo.collection(car.collectionName).insertOne(car);
    }

    private async createCollections(dbo: any, cars: Car[]): Promise<void>{
        for(let i = 0; i < cars.length; i++){
            await this.createOneCollection(dbo, cars[i].collectionName);
        }
        return;
    }

    private async createOneCollection(dbo: any, collectionName: string): Promise<string | undefined>{
        try{
            return await this.tryCreateOneCollection(dbo, collectionName);
        }catch(err: any){
            this.catch.deadCatch(err, `some error in create ${collectionName} collection in database! see log file for more information`)
        }
    }
    
    private async tryCreateOneCollection(dbo: any, collectionName: string): Promise<string>{
        await dbo.createCollection(collectionName, {
            validator: {
                $jsonSchema: this.carsSchema
                }
            }
        )
        return collectionName;
    }

    
    

    async getBrandAds(brandName: string): Promise<WithCategory[]>{
        const brandCollections  = await this.getBrandCollections(brandName);
        const ads = await this.getAds(brandCollections!);
        return ads;
    }

    private async getAds(brandCollections: string[]): Promise<WithCategory[]>{
        const connect = await this.createConnect(this.adsDBName);
        let ads: any[] = []
        for(let i = 0; i < brandCollections.length; i ++ ){
            let subNameAds = await connect!.dbo.collection(brandCollections[i]).find({}).toArray();
            let object = {
                'collectionName': brandCollections[i],
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
            await this.checkDatabase();
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

    

    private async createConnect(dbName: string): Promise<initDBConnect | undefined>{
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

    private async checkDatabase(): Promise<void | undefined>{
        try{
            return await this.tryCheckDatabase();
        }catch(err: any){
            this.catch.deadCatch(err, "some error in getting data from Database! see log file for more information")
        }   
    }

    private async tryCheckDatabase(): Promise<void>{
        const connect = await this.createConnect(this.adsDBName);
        const allCollections = await connect!.dbo.collections();
        if(allCollections.length == 0){
            throw new Error('the database is empty');
        }
        return;
    }


}