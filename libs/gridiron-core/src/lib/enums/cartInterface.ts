export interface ProdVar {
    id: string,
    name: string,
    assetUrl: string
}

export interface ProdStore {
    id: string
    storeName: string
}

export interface ProdVarPrice {
    id: string
    price: number
}

export interface CartItem {
    priceId: string,
    quantity: number
}
