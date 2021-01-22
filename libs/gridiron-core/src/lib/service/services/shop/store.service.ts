import {Injectable} from "@nestjs/common";
import {InjectConnection} from "@nestjs/typeorm";
import {Connection} from "typeorm";
import {Collection, Product, ProductVariant, Store, StoreTypeEnum, User, View} from "../../../entity";
import {ViewEnum} from "../../../enums";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class ShopStoreService {
    constructor(
        @InjectConnection() private connection: Connection,
        private readonly jwtService: JwtService
    ) {}

    async DecryptToken(token: string): Promise<{userId: string}> {
        return new Promise(async (resolve, reject) => {
            const decoded: any = await this.jwtService.decode(token)
            resolve(decoded)
        })
    }

    async GetDefaultStore(): Promise<Store> {
        return  this.connection.getRepository(Store).findOne({where:{type: StoreTypeEnum.DEFAULT}})
    }

    async createViews(
        slug: string,
        id: string,
        variant: ViewEnum,
        user?: string
    ): Promise<View> {
        return new Promise(async (resolve, reject) => {
            const view = new View()
            view.slug = slug
            if (variant === ViewEnum.COLLECTION) {
                view.collection = await this.connection.getRepository(Collection).findOne({where:{id}})
            }
            if (variant === ViewEnum.PRODUCT) {
                view.product = await this.connection.getRepository(Product).findOne({where:{id}})
            }
            if (variant === ViewEnum.VARIANT) {
                view.variant = await this.connection.getRepository(ProductVariant).findOne({where:{id}})
            }
            if (user) {
                view.user = await this.connection.getRepository(User).findOne({where:{id: user}})
            }
            this.connection.getRepository(View).save(view).then(value => {
                resolve(value)
            }).catch(error => reject(error))
        })
    }
}
