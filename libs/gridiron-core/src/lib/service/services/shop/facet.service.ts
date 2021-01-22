import {Injectable} from "@nestjs/common";
import {InjectConnection} from "@nestjs/typeorm";
import {Connection} from "typeorm";
import {Collection, FacetValue, Product} from "../../../entity";

@Injectable()
export class ShopFacetService {
    constructor(
       @InjectConnection() readonly connection: Connection
    ) {}

    async facetPageService(id: string, collection?): Promise<Product[]> {
        return new Promise(async (resolve, reject) => {
            const qb = this.connection.getRepository(Product).createQueryBuilder('product')
            qb.innerJoinAndSelect('product.facets', 'facets')
            qb.leftJoinAndSelect('product.collection', 'collection')
            qb.leftJoinAndSelect('product.featuredAsset', 'featuredAsset')
            if (collection) {
                qb.where(`facets.id = :id`, {id: id})
                qb.andWhere('collection.id = :id', {id: collection})
                qb.limit(100)
                const prods = await qb.getMany()
                resolve(prods)
            } else {
                qb.where(`facets.id = :id`, {id: id})
                qb.limit(100)
                const prods = await qb.getMany()
                resolve(prods)
            }
        })
    }

    async getFacetInfo(id: string): Promise<FacetValue> {
        return this.connection.getRepository(FacetValue).findOne({where:{id}, relations: ['facet']})
    }
}
