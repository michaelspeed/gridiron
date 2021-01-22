import {Injectable} from "@nestjs/common";
import {InjectConnection} from "@nestjs/typeorm";
import {Connection, In, MoreThan, Not} from "typeorm";
import {
    Asset,
    Product,
    ProductVariant,
    ProductVariantPrice,
    Review,
    StockKeeping,
    Store, User,
    Vendor, Zip
} from "../../../entity";
import {JwtService} from "@nestjs/jwt";

interface GetProductAssetInterface {
    variantId?: string
    prodId?: string
}

interface GetAvailability {
    stock: boolean
    zip: boolean
}

@Injectable()
export class ShopProductsService {
    constructor(
        @InjectConnection() private connection: Connection,
        private readonly jwtService: JwtService,
    ) {}

    async DecryptToken(token: string): Promise<{userId: string}> {
        return new Promise(async (resolve, reject) => {
            const decoded: any = await this.jwtService.decode(token)
            resolve(decoded)
        })
    }

    async getProductById(id: string): Promise<ProductVariant> {
        return this.connection.getRepository(ProductVariant).findOne(
            {where: {id},
                relations: [
                    'product',
                    'product.options',
                    'product.options.options',
                    'product.variants',
                    'product.collection',
                    'product.collection.seo',
                    'product.featuredAsset',
                    'product.facets',
                    'product.facets.facet',
                    'product.assets',
                    'product.assets.asset',
                    'asset',
                    'asset.asset',
                    'specs',
                    'seo',
                    'stock',
                    'price',
                    'reviews'
                ]}
            )
    }

    async getProdAsset({variantId, prodId}: GetProductAssetInterface): Promise<Asset> {
        return new Promise(async (resolve, reject) => {
            let asset
            if (variantId) {
                const variatn = await this.connection.getRepository(ProductVariant).findOne({where:{id: variantId}, relations: ['asset', 'asset.asset']})
                asset = variatn.asset.asset
            } else {
                const prod = await this.connection.getRepository(Product).findOne({where:{id: prodId}, relations: ['featuredAsset']})
                asset = prod.featuredAsset
            }
            resolve(asset)
        })
    }

    async getVariantsByProductId(id: string): Promise<ProductVariant[]> {
        return this.connection.getRepository(ProductVariant).find({
            where:{product: {id}},
            relations: [
                'product',
                'product.options',
                'product.options.options',
                'asset',
                'asset.asset',
                'specs',
                'seo',
                'stock',
                'price',
                'price.store',
            ]
        })
    }

    async singleProductById(id: string): Promise<Product> {
        return this.connection.getRepository(Product).findOne({
            where:{
                id
            },
            relations: ['collection', 'options', 'featuredAsset', 'facets', 'assets', 'variants']
        })
    }

    async getPriceForVariants(id: string, zip?: string): Promise<ProductVariant> {
        return new Promise(async (resolve, reject) => {
            this.connection.getRepository(ProductVariant)
                .findOne({where:{id}, relations: ['price','price.promoprice', 'price.store', 'price.store.vendor', 'price.store.vendor.zip']})
                .then(value => resolve(value))
                .catch(error => reject(error))
        })
    }

    async GetStocksAndZipAvailability(variantId: string, zipf: number): Promise<ProductVariantPrice[]> {
        return new Promise(async (resolve, reject) => {
            /*const zips = await this.connection.getRepository(Zip).findOne({where:{code: zipf}, relations: ['store']})
            const stores = zips.store.map(item => item.id)
            const qb = await this.connection.getRepository(ProductVariantPrice)
                .createQueryBuilder('ProductVariantPrice')
                .innerJoinAndSelect('ProductVariantPrice.store', 'store')
                .innerJoinAndSelect('ProductVariantPrice.variant', 'variant')
                .leftJoinAndSelect('ProductVariantPrice.variant', 'variant')
                .leftJoinAndSelect('ProductVariantPrice.store', 'store')
                .where('store.id IN (:...stores)', {stores})
                .andWhere('variant.id := variant', {variant: variantId})
                .getMany()

            resolve(qb)*/
            const stocks = await this.connection.getRepository(StockKeeping).find({where:{variant:{id: variantId} }, relations: ['store']})
            const filteredStocks = stocks.filter(item => {
                if (item.backorder) {
                    return item
                } else if (item.quantity > 0) {
                    return item
                }
            })
            const storeIds: any[] = filteredStocks.map(stock => stock.store.id)
            const storeZip = await this.connection.getRepository(Zip).findOne({where:{code: zipf}, relations: ['store']})
            const zipStores: any[] = storeZip.store.map(st => st.id)
            const finalZips = storeIds.filter(item => zipStores.includes(item))
            console.log(finalZips)
            if (finalZips.length === 0) {
                resolve([])
            }
            // const prodPrices = await this.connection.getRepository(ProductVariantPrice).find({where:{variant:{id: variantId}, store: {id: In(finalZips)}}, relations: ['store']})
            const qb = await this.connection.getRepository(ProductVariantPrice)
                .createQueryBuilder('ProductVariantPrice')
                .innerJoinAndSelect('ProductVariantPrice.variant', 'variant')
                .innerJoinAndSelect('ProductVariantPrice.store', 'store')
                .where('store.id IN (:...stores)', {stores: finalZips})
                .andWhere('variant.id = :variant', {variant: variantId})
                .getMany()
            resolve(qb)
        })
    }

    async ShiftProductVariant(name: string, productId: string): Promise<ProductVariant> {
        return new Promise(async (resolve, reject) => {
            const allvars = await this.connection.getRepository(ProductVariant).find({where:{product:{id: productId}}})
            const nameSplit = name.split(" ")
            for (const vars of allvars) {
                const varsplit = vars.name.replace(/[^a-zA-Z0-9 ]/gi, '').split(" ")
                if (nameSplit.every(elm => varsplit.includes(elm))) {
                    resolve(vars)
                }
            }
        })
    }

    async CreateReview(varId: string, text: string, stars: number, token: string): Promise<Review> {
        return new Promise(async (resolve, reject) => {
            const rev = new Review()
            const user = await this.DecryptToken(token)
            rev.user = await this.connection.getRepository(User).findOne({where:{id: user.userId}})
            rev.variant = await this.connection.getRepository(ProductVariant).findOne({where:{id: varId}})
            rev.stars = stars
            rev.text = text
            this.connection.getRepository(Review)
                .save(rev)
                .then(value => resolve(value))
                .catch(error => reject(error))
        })
    }

    async reviewsForVariant(id: string): Promise<Review[]> {
        return new Promise(async (resolve, reject) => {
            const revs = await this.connection.getRepository(Review).find({where:{variant:{id}}, take: 10})
            resolve(revs)
        })
    }

    async getSingleProductVariantPrices(id: string): Promise<ProductVariantPrice> {
        return new Promise(async (resolve, reject) => {
            const variants = await this.connection.getRepository(ProductVariant).find({where:{product: {id}}, relations: ['price']})
            let allPrices: ProductVariantPrice[] = []
            for (const varsf of variants) {
                allPrices.push(...varsf.price)
            }
            if (allPrices.length === 0) {
                const varprices = new ProductVariantPrice()
                varprices.price = 0
                varprices.id = id
                varprices.taxIncluded = true
                resolve(varprices)
            } else {
                let lowcost: ProductVariantPrice
                for (const price of allPrices) {
                    if (!lowcost) {
                        lowcost = price
                    } else {
                        if (lowcost.price > price.price) {
                            lowcost = price
                        }
                    }
                }
                resolve(lowcost)
            }
        })
    }
}
