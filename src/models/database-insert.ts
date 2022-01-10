import { Car } from "../interfaces/interfaces.js";
import Database from "./databse.js";

export default class Insert extends Database{

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
        super();
    }

    async insertCarsIntoDatabase(cars: Car[]){
        const connect = await this.createConnect(this.carsDBName);
        await this.createEmptyCollections(connect!.dbo, cars);
        await this.insertCars(connect!.dbo, cars)
        connect?.client.close();
        return;
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
            return;
        }catch(err: any){
            this.catch.aliveCatch(err, `some error in insert ${car.name} ${car.subName} record in ${car.collectionName} collection! see log file for more information`)
        }
    }

    private async tryInsert(dbo: any, car: Car){
        let brandName = car.collectionName.replace(/[0-9]/g,'');
        await dbo.collection(brandName).insertOne(car);
    }

    private async createEmptyCollections(dbo: any, cars: Car[]): Promise<void>{
        for(let i = 0; i < cars.length; i++){
            let brandName = cars[i].collectionName.replace(/[0-9]/g,'');
            const colExists = await (await dbo.listCollections().toArray()).findIndex((item: any) => item.name === brandName) !== -1;
            if(!colExists){
                await this.createCollection(dbo, brandName);
            }else{
                await this.clearCollection(dbo, brandName);
            }
        }
        return;
    }

    private async clearCollection(dbo: any, collectionName: string): Promise<void>{
        try{
            await this.tryClearCollection(dbo, collectionName);
            return;
        }catch(err: any){
            this.catch.aliveCatch(err, `some error in clearing ${collectionName} collection in database! see log file for more information`);
        }
    }

    private async tryClearCollection(dbo: any, collectionName: string): Promise<void>{
        await dbo.collection(collectionName).deleteMany({});
        return;
    }

    private async createCollection(dbo: any, collectionName: string): Promise<void | undefined>{
        try{
            return await this.tryCreateCollection(dbo, collectionName);
        }catch(err: any){
            this.catch.deadCatch(err, `some error in create ${collectionName} collection in database! see log file for more information`);
        }
    }
    
    private async tryCreateCollection(dbo: any, collectionName: string): Promise<void>{
        await dbo.createCollection(collectionName, {
            validator: {
                $jsonSchema: this.carsSchema
                }
            }
        );
        return;
    }

}