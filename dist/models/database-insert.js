import Database from "./databse.js";
import DateHandler from "./date.js";
export default class Insert extends Database {
    constructor() {
        super();
        this.carsSchema = {
            bsonType: "object",
            required: ["_id", "name", "subName", "collectionName", "variants", "lastUpdate", "isActive", "specs"],
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
                },
                lastUpdate: {
                    bsonType: "string",
                    description: "last time variants updated"
                },
                isActive: {
                    bsonType: "bool",
                    description: "is car active for suggestion",
                },
                specs: {
                    bsonType: "string",
                    description: "car specifications that added by operator"
                }
            }
        };
        this.date = new DateHandler();
    }
    // async insertCarsIntoDatabase(brandCars: Car[]){
    //     const connect = await this.createConnect(this.carsDBName);
    //     await this.createEmptyCollections(connect!.dbo, brandCars);
    //     await this.insertCars(connect!.dbo, brandCars)
    //     connect?.client.close();
    //     return;
    // }
    async insertCarsIntoDatabaseTmp(brandCars) {
        const connect = await this.createConnect(this.carsDBName);
        const brandName = brandCars[0].collectionName.replace(/[0-9]/g, '');
        const colExists = await (await connect.dbo.listCollections().toArray()).findIndex((item) => item.name === brandName) !== -1;
        if (!colExists) {
            await this.createCollection(connect.dbo, brandName);
            console.log("collection created!");
        }
        for (let i = 0; i < brandCars.length; i++) {
            const modelName = brandCars[i].name;
            const modelSubName = brandCars[i].subName;
            const documents = await connect.dbo.collection(brandName).find({ name: modelName, subName: modelSubName }).toArray();
            // console.log(documents);
            if (documents.length == 0) {
                await this.insertCarTmp(connect.dbo, brandCars[i]);
                console.log("car inserted!");
                continue;
            }
            else {
                console.log("document exists!");
            }
        }
    }
    async createCollectionTmp() { }
    async createDocumentTmp() { }
    async createVariantTmp() { }
    async updateTmp() { }
    async insertCarTmp(dbo, car) {
        try {
            await this.tryInsertTmp(dbo, car);
            return;
        }
        catch (err) {
            this.catch.aliveCatch(err, `some error in insert ${car.name} ${car.subName} record in ${car.collectionName} collection! see log file for more information`);
        }
    }
    async tryInsertTmp(dbo, car) {
        const brandName = car.collectionName.replace(/[0-9]/g, '');
        const lastUpdate = this.date.getCurrentGDate();
        const isActive = false;
        const specs = 'test';
        car['lastUpdate'] = lastUpdate;
        car['isActive'] = isActive;
        car['specs'] = specs;
        // console.log(car);
        await dbo.collection(brandName).insertOne(car);
    }
    // private async determinKindOfInsert(dbo: any, brandCar: Car): Promise<InsertActionScenaio>{
    //     const brandName = brandCar.collectionName.replace(/[0-9]/g,'');
    //     const modelName = brandCar.name;
    //     const modelSubName = brandCar.subName;   
    //     const colExists = await (await dbo.listCollections().toArray()).findIndex((item: any) => item.name === brandName) !== -1;
    //     const document = await dbo.collection(brandName).find({name: modelName, subName: modelSubName}).toArray();
    //     const variant = document[0].variants;
    //     console.log(brandCar);
    //     console.log(variant);
    //     console.log('--------------------------------');
    //     if(!colExists){
    //         return 'No Collection';
    //     }else if(document.length == 0){
    //         return 'No Document';
    //     }
    //     return 'No Document';
    // }
    // private async insertCars(dbo: any, cars: Car[]){
    //     for(let i = 0; i < cars.length; i++){
    //         await this.insertCar(dbo, cars[i]);
    //     }
    //     return;
    // }
    // private async insertCar(dbo: any, car: Car){
    //     try{
    //         await this.tryInsert(dbo,car);
    //         return;
    //     }catch(err: any){
    //         this.catch.aliveCatch(err, `some error in insert ${car.name} ${car.subName} record in ${car.collectionName} collection! see log file for more information`)
    //     }
    // }
    // private async tryInsert(dbo: any, car: Car){
    //     let brandName = car.collectionName.replace(/[0-9]/g,'');
    //     await dbo.collection(brandName).insertOne(car);
    // }
    // private async createEmptyCollections(dbo: any, cars: Car[]): Promise<void>{
    //     for(let i = 0; i < cars.length; i++){
    //         let brandName = cars[i].collectionName.replace(/[0-9]/g,'');
    //         const colExists = await (await dbo.listCollections().toArray()).findIndex((item: any) => item.name === brandName) !== -1;
    //         if(!colExists){
    //             await this.createCollection(dbo, brandName);
    //         }else{  
    //             await this.clearCollection(dbo, brandName);
    //         }
    //     }
    //     return;
    // }
    // private async clearCollection(dbo: any, collectionName: string): Promise<void>{
    //     try{
    //         await this.tryClearCollection(dbo, collectionName);
    //         return;
    //     }catch(err: any){
    //         this.catch.aliveCatch(err, `some error in clearing ${collectionName} collection in database! see log file for more information`);
    //     }
    // }
    // private async tryClearCollection(dbo: any, collectionName: string): Promise<void>{
    //     await dbo.collection(collectionName).deleteMany({});
    //     return;
    // }
    async createCollection(dbo, collectionName) {
        try {
            return await this.tryCreateCollection(dbo, collectionName);
        }
        catch (err) {
            this.catch.deadCatch(err, `some error in create ${collectionName} collection in database! see log file for more information`);
        }
    }
    async tryCreateCollection(dbo, collectionName) {
        await dbo.createCollection(collectionName, {
            validator: {
                $jsonSchema: this.carsSchema
            }
        });
        return;
    }
}
