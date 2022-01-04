import { ObjectId } from "mongodb";

export interface initDBConnect{
    'client': any,
    'dbo': any
}

export interface adResult{
    '_id': ObjectId,
    'name': string,
    'subName': string,
    'prodYear': string,
    'city': string,
    'price': number,
    'date': {
        'pDate': string,  
        'gDate': string
    },
    'collectionName': string 
} 

export interface CategorizedAdResult{
    'collection': string,
    'name': string,
    'subName': string,
    'ads': adResult[]
}

export interface withVariants{
    'collection': string,
    'name': string,
    'subName': string,
    'ads': adResult[],
    'variants': Variant[]
}

export interface Variant{
    'prodYear': string,
    'noOfAds': number,
    'minPrice': number
}