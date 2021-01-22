import {Injectable} from "@nestjs/common";
import {InjectConnection} from "@nestjs/typeorm";
import {Connection} from "typeorm";
import {ProductVariantPrice, PromotionVariantPrice, Vendor} from "@gridiron/core";

@Injectable()
export class PromotionPriceVariantService {
    constructor(
        @InjectConnection() readonly connection: Connection
    ) {}

    async GetPromotionPriceForStore(userId: string): Promise<ProductVariantPrice[]> {
        return new Promise(async (resolve, reject) => {
            const vendor = await this.connection.getRepository(Vendor).findOne({where:{user: {id: userId}}, relations: ['store']})
            const promoPrice = await this.connection.getRepository(ProductVariantPrice)
                .find({where:{store:{id: vendor.store.id}}, relations: ['promoprice'], order:{createdAt: "DESC"}})
            let allPrices = []
            for (const itsm of promoPrice) {
                if (itsm.promoprice !== null) {
                    allPrices.push(itsm)
                }
            }
            reject(allPrices)
        })
    }
}
