import Variables from "../variables/variables.js";
import Database from "./databse.js";
export default class Fetch extends Database {
    constructor() {
        super();
        this.variables = new Variables();
        this.adsDBName = this.variables.adsDBName;
    }
    async getAllBrandNames() {
        const allCollections = await this.getAllCollections();
        const allBrands = this.extractBrandNamesFromCollections(allCollections);
        return allBrands;
    }
    async getBrandAds(brandName) {
        const brandCollections = await this.getBrandCollections(brandName);
        const ads = await this.getAds(brandCollections);
        return ads;
    }
    extractBrandNamesFromCollections(allCollections) {
        let brandNames = [];
        for (let i = 0; i < allCollections.length; i++) {
            const collectionName = allCollections[i].namespace.replace(this.adsDBName + '.', '');
            const brandName = collectionName.replace(/[0-9]/g, '');
            if (!brandNames.includes(brandName)) {
                brandNames.push(brandName);
            }
        }
        return brandNames;
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
        const allCollections = await this.getAllCollections();
        const brandCollections = await this.returnBrandCollectionsFromAllCollections(brandName, allCollections);
        return brandCollections;
    }
    async getAllCollections() {
        const connect = await this.createConnect(this.adsDBName);
        await this.checkDatabase(this.adsDBName);
        const allCollections = await connect.dbo.collections();
        connect.client.close();
        return allCollections;
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
}
