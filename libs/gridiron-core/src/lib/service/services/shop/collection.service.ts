import {Injectable} from "@nestjs/common";
import {InjectConnection} from "@nestjs/typeorm";
import {Connection, getConnection, In, Not} from "typeorm";
import {Collection, FacetValue, ProductVariant, Search} from "../../../entity";

@Injectable()
export class ShopCollectionService {
    constructor(
        @InjectConnection() private connection: Connection
    ) {}

    async getCollections(): Promise<Collection[]> {
        return this.connection.getRepository(Collection).find({where: {name: Not('default')}})
    }

    async GetCollectionTree(): Promise<Collection[]> {
        return getConnection().getTreeRepository(Collection).findTrees()
    }

    async GetSingleCollection(id: string): Promise<Collection> {
        return this.connection.getRepository(Collection).findOne({where:{id}, relations: ['seo', 'children']})
    }

    async GetCollectionFacets(id: string): Promise<FacetValue[]> {
        return new Promise(async (resolve, reject) => {
            const col = await this.connection.getRepository(Collection).findOne({where:{id}, relations:['products', 'children', 'children.products']})
            let prods = []
            for (const progs of col.products) {
                prods.push(progs.id)
            }
            for(const child of col.children) {
                for (const childprod of child.products) {
                    if (prods.indexOf(childprod.id) === -1) {
                        prods.push(childprod.id)
                    }
                }
            }
            if (prods.length === 0) {
                resolve([])
            } else {
                const facets = await this.connection.getRepository(FacetValue)
                    .createQueryBuilder('facetValue')
                    .innerJoinAndSelect('facetValue.product', 'product')
                    .leftJoinAndSelect('facetValue.facet', 'facet')
                    .where(`product.id IN (:...prods)`, {prods}).getMany()
                resolve(facets)
            }
        })
    }

    async GetAllProductForCollection(id: string, limit?: number, search?: string): Promise<ProductVariant[]> {
        return new Promise(async (resolve, reject) => {
            const col = await this.connection.getRepository(Collection).findOne({where:{id}, relations:['products', 'children']})
            let colIds = []
            colIds.push(col.id)
            for (const cods of col.children) {
                colIds.push(cods.id)
            }
            const qb = this.connection.getRepository(ProductVariant)
                .createQueryBuilder('productVariant')
                .innerJoinAndSelect('productVariant.product', 'product')
                .innerJoinAndSelect('product.collection', 'collection')
                .leftJoinAndSelect('productVariant.asset', 'asset')
                .leftJoinAndSelect('productVariant.price', 'price')
                .leftJoinAndSelect('asset.asset', 'mainasset')
                .where(`collection.id IN (:...colls)`, {colls: colIds})

            if (search) {
                qb.andWhere(`(productVariant.name LIKE '%${search}%')`)
            }

            if (limit) {
                qb.limit(limit)
            }

            const variant = await qb.getMany()
            resolve(variant)
        })
    }

    async GetAllProdsWithPriceRangeAndFacet(colId: string, facetIds: string[], start?: number, last?: number, search?: string): Promise<ProductVariant[]> {
        return new Promise(async (resolve, reject) => {
            const col = await this.connection.getRepository(Collection).findOne({where:{id: colId}, relations:['products', 'children']})
            let colIds = []
            colIds.push(col.id)
            for (const cods of col.children) {
                colIds.push(cods.id)
            }
            const qb = this.connection.getRepository(ProductVariant)
                .createQueryBuilder('productVariant')
                .innerJoinAndSelect('productVariant.product', 'product')
                .innerJoinAndSelect('product.collection', 'collection')
                .innerJoinAndSelect('product.facets', 'facets')
                .innerJoinAndSelect('productVariant.price', 'price')
                .leftJoinAndSelect('productVariant.asset', 'asset')
                .leftJoinAndSelect('asset.asset', 'mainasset')
                .where(`collection.id IN (:...colls)`, {colls: colIds})

            if (start) {
                qb.andWhere('price.price > :start', {start})
            }

            if (last) {
                qb.andWhere('price.price < :last', {last})
            }

            if (facetIds.length > 0) {
                qb.andWhere('facets.id IN (:...facetIds)', {facetIds})
            }

            if (search) {
                qb.andWhere(`(productVariant.name LIKE '%${search}%') OR (collection.name LIKE '%${search}%') OR (facets.code LIKE '%${search}%')`)
                const newsearch = new Search()
                newsearch.search = search;
                await this.connection.getRepository(Search).save(newsearch)
            }

            const variant = await qb.getMany()
            resolve(variant)
        })
    }
}
