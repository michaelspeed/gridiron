import { ProductVariantPrice, Vendor } from "@gridiron/entities";
import {Injectable} from "@nestjs/common";
import {InjectConnection} from "@nestjs/typeorm";
import {Connection} from "typeorm";

@Injectable()
export class PromotionPriceVariantService {
    constructor(
        @InjectConnection() readonly connection: Connection
    ) {}

    async GetPromotionPriceForStore(userId: string): Promise<ProductVariantPrice[]> {
        return new Promise(async (resolve) => {
            const vendor = await this.connection.getRepository(Vendor).findOne({where:{user: {id: userId}}, relations: ['store']})
            const promoPrice = await this.connection.getRepository(ProductVariantPrice)
                .find({where:{store:{id: vendor.store.id}}, relations: ['promoprice'], order:{createdAt: "DESC"}})
            const allPrices = []
            for (const itsm of promoPrice) {
                if (itsm.promoprice !== null) {
                    allPrices.push(itsm)
                }
            }
            resolve(allPrices)
        })
    }
}
