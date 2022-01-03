import Database from "./databse.js";
export default class ManualCompiler {
    constructor() {
        this.database = new Database();
    }
    async compile(brandName) {
        const brandAds = await this.database.getBrandAds(brandName);
        const compiledBrandAds = [];
        brandAds.forEach((subAds) => {
            const prodYears = this.extractProdYear(subAds);
            const variants = this.adProdYearVariant(subAds);
            subAds.variants = variants;
            compiledBrandAds.push(subAds);
        });
        console.log(compiledBrandAds[2].collection);
        console.log(compiledBrandAds[2].variants);
        // const prodYears = this.extractProdYear(brandAds[0]);
        // this.adProdYearVariant(brandAds[0]);
    }
    adProdYearVariant(subAds) {
        const prodYears = this.extractProdYear(subAds);
        const variants = this.extractPricesOfEachYear(subAds.ads, prodYears);
        return variants;
    }
    extractProdYear(subAds) {
        let prodYears = [];
        subAds.ads.forEach((ad) => {
            prodYears.push(ad.prodYear);
        });
        return prodYears.filter(function (value, index, array) {
            return array.indexOf(value) === index;
        });
    }
    extractPricesOfEachYear(subAds, prodYears) {
        let variants = [];
        prodYears.forEach((prodYear) => {
            const prices = [];
            subAds.forEach((ad) => {
                if (ad.prodYear == prodYear) {
                    prices.push(ad.price);
                }
            });
            variants.push({
                'prodYear': prodYear,
                'prices': prices
            });
        });
        return variants;
    }
}
