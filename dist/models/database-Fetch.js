import Variables from "../variables/variables.js";
import Database from "./databse.js";
export default class Fetch extends Database {
    constructor() {
        super();
        this.variables = new Variables();
        this.adsDBName = this.variables.adsDBName;
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
        await this.checkDatabase(this.adsDBName);
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
}
