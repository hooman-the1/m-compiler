import Database from "./databse.js";
export default class Insert extends Database {
    constructor() {
        super();
        this.carsSchema = {
            bsonType: "object",
            required: ["_id", "name", "subName", "collectionName", "variants", "isActive", "specs"],
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
                isActive: {
                    bsonType: "boolean",
                    description: "is car active for suggestion",
                },
                specs: {
                    bsonType: "object",
                    description: "car specifications that added by operator"
                }
            }
        };
    }
    async insertCarsIntoDatabase(cars) {
        const connect = await this.createConnect(this.carsDBName);
        await this.createEmptyCollections(connect.dbo, cars);
        await this.insertCars(connect.dbo, cars);
        connect === null || connect === void 0 ? void 0 : connect.client.close();
        return;
    }
    async insertCars(dbo, cars) {
        for (let i = 0; i < cars.length; i++) {
            await this.insertCar(dbo, cars[i]);
        }
        return;
    }
    async insertCar(dbo, car) {
        try {
            await this.tryInsert(dbo, car);
            return;
        }
        catch (err) {
            this.catch.aliveCatch(err, `some error in insert ${car.name} ${car.subName} record in ${car.collectionName} collection! see log file for more information`);
        }
    }
    async tryInsert(dbo, car) {
        let brandName = car.collectionName.replace(/[0-9]/g, '');
        await dbo.collection(brandName).insertOne(car);
    }
    async createEmptyCollections(dbo, cars) {
        for (let i = 0; i < cars.length; i++) {
            let brandName = cars[i].collectionName.replace(/[0-9]/g, '');
            const colExists = await (await dbo.listCollections().toArray()).findIndex((item) => item.name === brandName) !== -1;
            if (!colExists) {
                await this.createCollection(dbo, brandName);
            }
            else { //if brand name exist in db
                await this.clearCollection(dbo, brandName);
                // await this.insertToCollection(dbo, brandName);
            }
        }
        return;
    }
    // private async insertToCollection(dbo: any, brandName)
    async clearCollection(dbo, collectionName) {
        try {
            await this.tryClearCollection(dbo, collectionName);
            return;
        }
        catch (err) {
            this.catch.aliveCatch(err, `some error in clearing ${collectionName} collection in database! see log file for more information`);
        }
    }
    async tryClearCollection(dbo, collectionName) {
        await dbo.collection(collectionName).deleteMany({});
        return;
    }
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
