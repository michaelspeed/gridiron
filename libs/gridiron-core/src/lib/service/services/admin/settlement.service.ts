import {Injectable} from "@nestjs/common";
import {InjectConnection} from "@nestjs/typeorm";
import {Connection} from "typeorm";
import {Settlements, Store, StoreBalance, Vendor, VendorPlans} from "../../../entity";
import {SettlementType, VendorPlanPrice} from "../../../enums";
import {ConfigService} from "../../../config";

@Injectable()
export class SettlementService {
    constructor(
        @InjectConnection() private connection: Connection,
        private readonly confgiService: ConfigService
    ) {}

    async CreateSettlement(storeId: string): Promise<Settlements> {
        return new Promise(async (resolve, reject) => {
            const store = await this.connection.getRepository(Store).findOne({where:{id: storeId}, relations: ['balance', 'vendor']})
            const vendor = await this.connection.getRepository(Vendor).findOne({where:{id: store.vendor.id}, relations: ['license', 'license.plans']})
            const plan = await this.connection.getRepository(VendorPlans).findOne({where:{id: vendor.license.plans.id}})
            const amount = store.balance.balance
            const balance = await this.connection.getRepository(StoreBalance).findOne({where:{id: store.balance.id}})
            const settlement = new Settlements()
            switch (plan.priceStrategy) {
                case VendorPlanPrice.FLAT: {
                    const tax = amount * (this.confgiService.flatFeeAmount / 100)
                    const final = amount - tax
                    settlement.amount = amount
                    settlement.finalamount = final
                    settlement.taxamount = tax
                    settlement.type = SettlementType.PROCESSING
                    settlement.store = store
                    balance.balance = 0
                    await this.connection.getRepository(StoreBalance).save(balance)
                    this.connection.getRepository(Settlements)
                        .save(settlement)
                        .then(value => {
                            resolve(value)
                        })
                        .catch(error => reject(error))
                }
                break;
                case VendorPlanPrice.INDIVIDUALCOLLECTION: {
                    settlement.amount = amount
                    settlement.finalamount = amount
                    settlement.taxamount = 0
                    settlement.type = SettlementType.PROCESSING
                    settlement.store = store
                    balance.balance = 0
                    await this.connection.getRepository(StoreBalance).save(balance)
                    this.connection.getRepository(Settlements)
                        .save(settlement)
                        .then(value => {
                            resolve(value)
                        })
                        .catch(error => reject(error))
                }
                break;
                case VendorPlanPrice.COMMISSION: {
                    settlement.amount = amount
                    settlement.finalamount = amount
                    settlement.taxamount = 0
                    settlement.type = SettlementType.PROCESSING
                    settlement.store = store
                    balance.balance = 0
                    await this.connection.getRepository(StoreBalance).save(balance)
                    this.connection.getRepository(Settlements)
                        .save(settlement)
                        .then(value => {
                            resolve(value)
                        })
                        .catch(error => reject(error))
                }
                break;
            }
        })
    }

    async UpdateSettlement(transId: string, settlementId: string): Promise<Settlements> {
        return new Promise(async (resolve, reject) => {
            const settlement = await this.connection.getRepository(Settlements).findOne({where:{id: settlementId}})
            settlement.type = SettlementType.PROCESSED
            settlement.transactionID = transId
            this.connection.getRepository(Settlements).save(settlement)
                .then(value => resolve(value))
                .catch(error => reject(error))
        })
    }

}
