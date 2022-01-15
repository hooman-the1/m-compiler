import { ObjectId } from "mongodb";

export interface initDBConnect{
    'client': any,
    'dbo': any
}

export interface adFetch{
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

export interface WithCategory{
    'collectionName': string,
    'name': string,
    'subName': string,
    'ads': adFetch[]
}

export interface withVariants{
    'collectionName': string,
    'name': string,
    'subName': string,
    'ads': adFetch[],
    'variants': Variant[]
}

export interface Variant{
    'prodYear': string,
    'noOfAds': number,
    'minPrice': number
}

export interface Car{
    'collectionName': string,
    'name': string,
    'subName': string,
    'variants': Variant[]
} 

export type InsertActionScenaio = 'No Collection' | 'No Document' | 'No Variant'| 'Update'  