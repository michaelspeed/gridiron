import {Injectable} from "@nestjs/common";
import {InjectConnection} from "@nestjs/typeorm";
import {Connection} from "typeorm";
import {PaymentMethod} from "../../../entity";

@Injectable()
export class PaymentMethodService {
    constructor(
        @InjectConnection() private readonly connection: Connection
    ) {}

    async GetAllPaymentMethods(): Promise<PaymentMethod[]> {
        return this.connection.getRepository(PaymentMethod).find()
    }

    async CreatePaymentMethod(api: string, secret: string): Promise<PaymentMethod> {
        return new Promise(async (resolve, reject) => {
            const allModes = await this.connection.getRepository(PaymentMethod).find({where:{enabled: true}})
            for (const modes of allModes) {
                modes.enabled = false
                await modes.save()
            }
            const pmMethod = new PaymentMethod()
            pmMethod.api = api
            pmMethod.secretKey = secret
            this.connection.getRepository(PaymentMethod)
                .save(pmMethod)
                .then(value => resolve(value))
                .catch(error => reject(error))
        })
    }

    async UpdatePaymentMethod(modeId: string, enabled: boolean): Promise<PaymentMethod> {
        return new Promise(async (resolve, reject) => {
            if (enabled) {
                const allModes = await this.connection.getRepository(PaymentMethod).find({where:{enabled: true}})
                for (const modes of allModes) {
                    modes.enabled = false
                    await modes.save()
                }
                const getOneMode = await this.connection.getRepository(PaymentMethod).findOne({where:{id: modeId}})
                getOneMode.enabled = enabled
                getOneMode.save().then(value => resolve(value)).catch(error => reject(error))
            } else {
                const getOneMode = await this.connection.getRepository(PaymentMethod).findOne({where:{id: modeId}})
                getOneMode.enabled = enabled
                getOneMode.save().then(value => resolve(value)).catch(error => reject(error))
            }
        })
    }

    async GetDefaultPaymentMethod(): Promise<PaymentMethod> {
        return this.connection.getRepository(PaymentMethod).findOne({where:{enabled: true}})
    }
}
