import Variables from "../variables/variables.js";
import DB from 'mongodb';
import Catch from "./catch.js";
export default class Database {
    constructor() {
        this.carsSchema = {
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
        };
        this.variables = new Variables();
        this.dbName = this.variables.dbName;
        this.carsDBName = this.variables.carsDBName;
        this.mongoServer = this.variables.mongoServer;
        this.adsDBName = this.variables.adsDBName;
        this.MongoClient = DB.MongoClient;
        this.catch = new Catch();
    }
    async insertCarsIntoDatabase(cars) {
        const connect = await this.createConnect(this.carsDBName);
        await this.createEmptyCollections(connect.dbo, cars);
        await this.insertCars(connect.dbo, cars);
        connect === null || connect === void 0 ? void 0 : connect.client.close();
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
        }
        catch (err) {
            this.catch.aliveCatch(err, `some error in insert ${car.name} ${car.subName} record in ${car.collectionName} collection! see log file for more information`);
        }
        return;
    }
    async tryInsert(dbo, car) {
        await dbo.collection(car.collectionName).insertOne(car);
    }
    async createEmptyCollections(dbo, cars) {
        for (let i = 0; i < cars.length; i++) {
            const colExists = await (await dbo.listCollections().toArray()).findIndex((item) => item.name === cars[i].name) !== -1;
            if (colExists) {
                await this.createOneEmptyCollection(dbo, cars[i].collectionName);
            }
            else {
                await this.clearCollection(dbo, cars[i].collectionName);
            }
        }
        return;
    }
    async clearCollection(dbo, collectionName) {
        try {
            await this.tryClearCollection(dbo, collectionName);
        }
        catch (err) {
            this.catch.aliveCatch(err, `some error in clearing ${collectionName} collection in database! see log file for more information`);
        }
    }
    async tryClearCollection(dbo, collectionName) {
        await dbo.collection(collectionName).deleteMany({});
    }
    async createOneEmptyCollection(dbo, collectionName) {
        try {
            return await this.tryCreateOneEmptyCollection(dbo, collectionName);
        }
        catch (err) {
            this.catch.deadCatch(err, `some error in create ${collectionName} collection in database! see log file for more information`);
        }
    }
    async tryCreateOneEmptyCollection(dbo, collectionName) {
        const colExists = (await dbo.listCollections().toArray()).findIndex((item) => item.name === collectionName) !== -1;
        if (!colExists) {
            await dbo.createCollection(collectionName, {
                validator: {
                    $jsonSchema: this.carsSchema
                }
            });
        }
        return;
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
                'collectionName': brandCollections[i],
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
        const connect = await this.createConnect(this.adsDBName);
        await this.checkDatabase();
        const allCollections = await connect.dbo.collections();
        const brandCollections = await this.returnBrandCollectionsFromAllCollections(brandName, allCollections);
        connect.client.close();
        return brandCollections;
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
    async checkDatabase() {
        try {
            return await this.tryCheckDatabase();
        }
        catch (err) {
            this.catch.deadCatch(err, "some error in getting data from Database! see log file for more information");
        }
    }
    async tryCheckDatabase() {
        const connect = await this.createConnect(this.adsDBName);
        const allCollections = await connect.dbo.collections();
        if (allCollections.length == 0) {
            throw new Error('the database is empty');
        }
        return;
    }
}
