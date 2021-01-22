import {Controller} from "@nestjs/common";
import {InjectConnection} from "@nestjs/typeorm";
import {Between, Connection, getConnection} from "typeorm";
import {MessagePattern} from "@nestjs/microservices";
import {OrderLineMessages} from "../../job-queue";
import {Observable} from "rxjs";
import {asyncObservable} from "../../worker";
import {ConfigService, Logger} from "../../config";
import moment from "moment";
import * as _ from "lodash";
import {BillingAgreementEnum, InvoiceEnum, OrderStageType, RefundEnum} from "../../enums";
import {
    BillingAgreement,
    DeliveryPool,
    DeliverySignIn,
    DeliveryStranded,
    Invoice,
    OrderLine,
    ProductVariant,
    Refund,
    Store,
    StoreBalance,
    Vendor,
    VendorPlans
} from "../../entity";
import {VendorPlanPrice} from "../../enums/VendorPlan";

interface PoolInterface {
    id: string
    length: number
}

@Controller()
export class OrderController {
    constructor(
        @InjectConnection() private connection: Connection,
        private configService: ConfigService,
    ) {}

    @MessagePattern(OrderLineMessages.pattern)
    applyOrderLineChanges({lineId, type}: OrderLineMessages["data"]): Observable<OrderLineMessages["response"]> {
        return asyncObservable(async observer => {
            Logger.verbose(`Processing OrderLine ${lineId}`)
            const line = await this.connection.getRepository(OrderLine).findOne({where:{id: lineId}, relations:['store', 'item', 'item.productVariant']})
            switch (type) {
                case OrderStageType.PACKAGED: {
                    const deliverySignIns = await this.connection.getRepository(DeliverySignIn)
                        .find({
                            where: {
                                createdAt: Between(moment().startOf("day").toDate(), moment().endOf("day").toDate()),
                                online: true
                            },
                            relations: ['pool', 'pool.lines']
                        })
                    const deliveryPools: PoolInterface[] = []
                    for (const signIn of deliverySignIns) {
                        deliveryPools.push({
                            id: signIn.pool.id,
                            length: signIn.pool.lines.length
                        })
                    }
                    const ordered = _.orderBy(deliveryPools, e => e.length, ['desc'])
                    if (ordered.length === 0 ) {
                        const deliveryStranded = new DeliveryStranded()
                        deliveryStranded.orderId = lineId
                        this.connection.getRepository(DeliveryStranded)
                            .save(deliveryStranded)
                            .then(() => {
                                observer.next({
                                    lineId: line.id,
                                    type: OrderStageType.PACKAGED
                                })
                            })
                    } else if (ordered[0].length >= 10) {
                        const deliveryStranded = new DeliveryStranded()
                        deliveryStranded.orderId = lineId
                        getConnection().getRepository(DeliveryStranded)
                            .save(deliveryStranded)
                            .then(() => {
                                observer.next({
                                    lineId: line.id,
                                    type: OrderStageType.PACKAGED
                                })
                            })
                    } else {
                        line.pool = await this.connection.getRepository(DeliveryPool).findOne({where:{id: ordered[0].id}})
                        line.pool.save()
                            .then(() => {
                                observer.next({
                                    lineId: line.id,
                                    type: OrderStageType.PACKAGED
                                })
                            })
                    }
                }
                break;
                case OrderStageType.RETURNINITIATED:{
                    const deliverySignIns = await this.connection.getRepository(DeliverySignIn)
                        .find({
                            where: {
                                createdAt: Between(moment().startOf("day").toDate(), moment().endOf("day").toDate()),
                                online: true
                            },
                            relations: ['pool', 'pool.lines']
                        })
                    const deliveryPools: PoolInterface[] = []
                    for (const signIn of deliverySignIns) {
                        deliveryPools.push({
                            id: signIn.pool.id,
                            length: signIn.pool.lines.length
                        })
                    }
                    const ordered = _.orderBy(deliveryPools, e => e.length, ['desc'])
                    if (ordered.length === 0 ) {
                        const deliveryStranded = new DeliveryStranded()
                        deliveryStranded.orderId = lineId
                        this.connection.getRepository(DeliveryStranded)
                            .save(deliveryStranded)
                            .then(() => {
                                observer.next({
                                    lineId: line.id,
                                    type: OrderStageType.RETURNINITIATED
                                })
                            })
                    } else if (ordered[0].length >= 10) {
                        const deliveryStranded = new DeliveryStranded()
                        deliveryStranded.orderId = lineId
                        getConnection().getRepository(DeliveryStranded)
                            .save(deliveryStranded)
                            .then(() => {
                                observer.next({
                                    lineId: line.id,
                                    type: OrderStageType.RETURNINITIATED
                                })
                            })
                    } else {
                        line.pool = await this.connection.getRepository(DeliveryPool).findOne({where:{id: ordered[0].id}})
                        line.pool.save()
                            .then(() => {
                                observer.next({
                                    lineId: line.id,
                                    type: OrderStageType.RETURNINITIATED
                                })
                            })
                    }
                }
                break;
                case OrderStageType.DELIVERED: {
                    const store = await this.connection.getRepository(Store).findOne({where:{id: line.store.id}, relations:['vendor', 'balance']})
                    const vendor = await this.connection.getRepository(Vendor).findOne({where:{id: store.vendor.id}, relations: ['license', 'license.plans']})
                    const plan = await this.connection.getRepository(VendorPlans).findOne({where:{id: vendor.license.plans.id}})
                    const storeBalance = await this.connection.getRepository(StoreBalance).findOne({where:{id: store.balance.id}})
                    switch (plan.priceStrategy) {
                        case VendorPlanPrice.COMMISSION: {
                            const billingAgree = await this.connection.getRepository(BillingAgreement).findOne({where:{store:{id: store.id}, type: BillingAgreementEnum.COMISSIONBASE}})
                            const price: any = line.priceField
                            const totalPrice = (price.price * line.item.quantity)
                            const fee = totalPrice * ( billingAgree.value / 100 )
                            const tax = (fee * this.configService.defaultTax) / 100
                            const invoice = new Invoice()
                            invoice.type = InvoiceEnum.STORE
                            invoice.line = line
                            invoice.total = totalPrice
                            invoice.fees = fee
                            invoice.amount = totalPrice - (fee + tax)
                            invoice.tax = tax
                            invoice.store = store
                            await invoice.save()
                            const masterInv = new Invoice()
                            masterInv.type = InvoiceEnum.MASTER
                            masterInv.line = line
                            masterInv.total = totalPrice
                            masterInv.fees = fee
                            masterInv.amount = totalPrice - (fee + tax)
                            masterInv.tax = tax
                            masterInv.store = store
                            await masterInv.save()

                            // update store balance
                            storeBalance.balance = storeBalance.balance + (totalPrice - (fee + tax))
                            storeBalance.balanceVolume = storeBalance.balanceVolume + (totalPrice - (fee + tax))
                            await storeBalance.save()

                            const newInvoice = new Invoice()
                            newInvoice.line = line
                            newInvoice.type = InvoiceEnum.CONSUMER
                            newInvoice.store = store
                            await newInvoice.save()
                                .then(() => {
                                    observer.next({
                                        lineId: line.id,
                                        type: OrderStageType.DELIVERED
                                    })
                                })
                        }
                        break;
                        case VendorPlanPrice.INDIVIDUALCOLLECTION: {
                            const billingVariant = await this.connection.getRepository(BillingAgreement).findOne({where:{variant:{id: line.item.productVariant.id}, store:{id: store.id}}})
                            if (billingVariant) {
                                const price: any = line.priceField
                                const totalPrice = (price.price * line.item.quantity)
                                const fee = totalPrice * ( billingVariant.value / 100 )
                                const tax = (fee * this.configService.defaultTax) / 100
                                const invoice = new Invoice()
                                invoice.type = InvoiceEnum.STORE
                                invoice.line = line
                                invoice.total = totalPrice
                                invoice.fees = fee
                                invoice.amount = totalPrice - (fee + tax)
                                invoice.tax = tax
                                invoice.store = store
                                await invoice.save()
                                const masterInv = new Invoice()
                                masterInv.type = InvoiceEnum.MASTER
                                masterInv.line = line
                                masterInv.total = totalPrice
                                masterInv.fees = fee
                                masterInv.amount = totalPrice - (fee + tax)
                                masterInv.tax = tax
                                masterInv.store = store
                                await masterInv.save()

                                // update store balance
                                storeBalance.balance = storeBalance.balance + (totalPrice - (fee + tax))
                                storeBalance.balanceVolume = storeBalance.balanceVolume + (totalPrice - (fee + tax))
                                await storeBalance.save()

                                const newInvoice = new Invoice()
                                newInvoice.line = line
                                newInvoice.type = InvoiceEnum.CONSUMER
                                newInvoice.store = store
                                await newInvoice.save()
                                    .then(() => {
                                        observer.next({
                                            lineId: line.id,
                                            type: OrderStageType.DELIVERED
                                        })
                                    })

                            } else {
                                const variant = await this.connection.getRepository(ProductVariant).findOne({where:{id: line.item.productVariant.id}, relations: ['product', 'product.collection']})
                                const billingsCollection = await this.connection.getRepository(BillingAgreement).findOne({where:{variant:{id: variant.product.collection.id}, store:{id: store.id}}})
                                if (billingsCollection) {

                                    const price: any = line.priceField
                                    const totalPrice = (price.price * line.item.quantity)
                                    const fee = totalPrice * ( billingsCollection.value / 100 )
                                    const tax = (fee * this.configService.defaultTax) / 100
                                    const invoice = new Invoice()
                                    invoice.type = InvoiceEnum.STORE
                                    invoice.line = line
                                    invoice.total = totalPrice
                                    invoice.fees = fee
                                    invoice.amount = totalPrice - (fee + tax)
                                    invoice.tax = tax
                                    invoice.store = store
                                    await invoice.save()
                                    const masterInv = new Invoice()
                                    masterInv.type = InvoiceEnum.MASTER
                                    masterInv.line = line
                                    masterInv.total = totalPrice
                                    masterInv.fees = fee
                                    masterInv.amount = totalPrice - (fee + tax)
                                    masterInv.tax = tax
                                    masterInv.store = store
                                    await masterInv.save()

                                    // update store balance
                                    storeBalance.balance = storeBalance.balance + (totalPrice - (fee + tax))
                                    storeBalance.balanceVolume = storeBalance.balanceVolume + (totalPrice - (fee + tax))
                                    await storeBalance.save()


                                    const newInvoice = new Invoice()
                                    newInvoice.line = line
                                    newInvoice.type = InvoiceEnum.CONSUMER
                                    newInvoice.store = store
                                    await newInvoice.save()
                                        .then(() => {
                                            observer.next({
                                                lineId: line.id,
                                                type: OrderStageType.DELIVERED
                                            })
                                        })
                                }
                            }

                        }
                        break;
                        case VendorPlanPrice.FLAT: {
                            const price: any = line.priceField
                            const totalPrice = (price.price * line.item.quantity)

                            // update store balance
                            storeBalance.balance = storeBalance.balance + totalPrice
                            storeBalance.balanceVolume = storeBalance.balanceVolume + totalPrice
                            await storeBalance.save()

                            const newInvoice = new Invoice()
                            newInvoice.line = line
                            newInvoice.type = InvoiceEnum.CONSUMER
                            newInvoice.store = store
                            await newInvoice.save()
                                .then(() => {
                                    observer.next({
                                        lineId: line.id,
                                        type: OrderStageType.DELIVERED
                                    })
                                })
                        }
                        break;
                    }
                }
                break;
                case OrderStageType.RETURNED: {
                    const newRefund = new Refund()
                    newRefund.line = line
                    newRefund.stage = RefundEnum.INITIATED
                    newRefund.save()
                        .then(() => {
                            observer.next({
                                lineId: line.id,
                                type: type
                            })
                        })
                }
                break;
                case OrderStageType.RETURNEDREFUNDED: {
                    const store = await this.connection.getRepository(Store).findOne({where:{id: line.store.id}, relations:['vendor', 'balance']})
                    const vendor = await this.connection.getRepository(Vendor).findOne({where:{id: store.vendor.id}, relations: ['license', 'license.plans']})
                    const plan = await this.connection.getRepository(VendorPlans).findOne({where:{id: vendor.license.plans.id}})
                    const storeBalance = await this.connection.getRepository(StoreBalance).findOne({where:{id: store.balance.id}})
                    const allInvoice = await this.connection.getRepository(Invoice).find({where:{line:{id: line.id}}})
                    for (const allinv of allInvoice) {
                        if (allinv.type === InvoiceEnum.STORE) {
                            storeBalance.balance = (storeBalance.balance - allinv.amount)
                            storeBalance.balanceVolume = (storeBalance.balanceVolume - allinv.amount)
                            await storeBalance.save()
                        }
                        allinv.nulled = true
                        await allinv.save()
                    }
                    observer.next({
                        lineId: line.id,
                        type: type
                    })
                }
                break;
                case OrderStageType.PROCESSED: {

                }
                break;
                default:{
                    observer.next({
                        lineId: line.id,
                        type: type
                    })
                }
            }
        })
    }
}
