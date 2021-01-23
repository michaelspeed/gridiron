import {Injectable} from "@nestjs/common";
import {InjectConnection} from "@nestjs/typeorm";
import {Connection} from "typeorm";
import {PaymentMethod} from "../../../entity";

@Injectable()
export class ShopPaymentService {
    constructor(
        @InjectConnection() private connection: Connection,
    ) {}

    async getPaymentCodes(): Promise<PaymentMethod> {
        return new Promise(async (resolve, reject) => {
            this.connection.getRepository(PaymentMethod).findOne({where:{enabled: true}})
                .then(value => resolve(value))
                .catch(error => reject(error))
        })
    }
}
