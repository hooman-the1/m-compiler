export default class Calculator {
    addMinPrice(collections) {
        const ads = [];
        collections.forEach((collection) => {
            let variants = [];
            collection.variants.forEach((variant) => {
                let prices = this.removeOutlierPrices(variant.prices);
                let noOfAds = prices.length;
                let minPrice = this.calculateMinPrice(prices);
                // console.log('-------------------------');
                // console.log(collection.name + collection.subName);
                // console.log(variant.prodYear);
                // console.log(noOfAds);
                // console.log(prices);
                // console.log(minPrice);
                // console.log('-------------------------');
                variants.push({
                    'prodYear': variant.prodYear,
                    'noOfAds': noOfAds,
                    'minPrice': minPrice
                });
            });
            collection.variants = variants;
            ads.push(collection);
        });
        console.log(ads[2]);
    }
    calculateMinPrice(prices) {
        const minValue = eval(prices.join('+')) / prices.length;
        return minValue;
    }
    removeOutlierPrices(prices) {
        const size = prices.length;
        let q1, q3;
        if (size < 2) {
            return prices;
        }
        const sortedCollection = prices.slice().sort((a, b) => a - b);
        if ((size - 1) / 4 % 1 === 0 || size / 4 % 1 === 0) {
            q1 = 1 / 2 * (sortedCollection[Math.floor(size / 4) - 1] + sortedCollection[Math.floor(size / 4)]);
            q3 = 1 / 2 * (sortedCollection[Math.ceil(size * 3 / 4) - 1] + sortedCollection[Math.ceil(size * 3 / 4)]);
        }
        else {
            q1 = sortedCollection[Math.floor(size / 4)];
            q3 = sortedCollection[Math.floor(size * 3 / 4)];
        }
        const iqr = q3 - q1;
        const maxValue = q3 + iqr;
        const minValue = q1 - iqr;
        return sortedCollection.filter(value => (value <= maxValue) && (value >= minValue));
    }
}
