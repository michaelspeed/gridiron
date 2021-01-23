import {Injectable, OnModuleInit} from "@nestjs/common";
import {InjectConnection} from "@nestjs/typeorm";
import {Between, Connection} from "typeorm";
import {EventBus} from "../../../event-bus";
import {OrderLineDto} from "../../../api/dto/admin/OrderLineDto";
import {classToPlain} from "class-transformer";
import {OrderLineEvents} from "../../../event-bus";
import {merge} from "rxjs";
import {debounceTime} from "rxjs/operators";
import {Job, JobQueue, JobQueueService, OrderLineJobData, OrderLineMessages} from "../../../job-queue";
import {WorkerService} from "../../../worker";
import {Logger} from '../../../config/logger/GridIronLogger'
import { Order, User, OrderLine, ProductVariantPrice, OrderItem, OrderStageType, DeliverySignIn, DeliveryStranded, DeliveryPool, Store, Vendor, VendorPlans, StoreBalance, VendorPlanPrice, BillingAgreement, BillingAgreementEnum, Invoice, InvoiceEnum, ProductVariant, Refund, RefundEnum } from "@gridiron/entities";
import * as moment from "moment";
import * as _ from 'lodash';
import { ConfigService } from "../../../config/config.service";

interface PoolInterface {
    id: string
    length: number
}

@Injectable()
export class OrderService implements OnModuleInit {

    private applyOrderQueue: JobQueue<OrderLineJobData>

    constructor(
        @InjectConnection() private connection: Connection,
        private eventBus: EventBus,
        private jobQueueService: JobQueueService,
        private workerService: WorkerService,
        private configService: ConfigService,
    ) {}

    onModuleInit() {
        const orderLineEvents$ = this.eventBus.ofType(OrderLineEvents)
        merge(orderLineEvents$)
            .pipe(debounceTime(50))
            .subscribe(async (event: OrderLineEvents) => {
                this.applyOrderQueue.add({
                    lineId: event.orderLine.id,
                    type: event.type
                })
            })

        this.applyOrderQueue = this.jobQueueService.createQueue({
            name: 'ApplyOrderLine',
            concurrency: 1,
            process: async (job) => {
                // this.onOrderPackages(job.data.lineId, job.data.type, job)
                this.applyOrderLineChanges({lineId: job.data.lineId, type: job.data.type})
            }
        })
    }

    async createOrder(userId: string, priceIds: OrderLineDto[], address: string): Promise<Order> {
        return new Promise(async (resolve) => {
            console.log(userId, priceIds, address)
            const neworder = new Order()
            neworder.user = await this.connection.getRepository(User).findOne({id: userId})
            const prodVars: OrderLine[] = []
            let totalAmt = 0
            for (const prices of priceIds) {
                const productPrice = await this.connection.getRepository(ProductVariantPrice).findOne({where:{id: prices.priceId}, relations: ['variant', 'tax', 'store']})
                const newOrderItem = new OrderItem()
                newOrderItem.quantity = prices.quantity
                newOrderItem.productVariant = productPrice.variant
                newOrderItem.taxCategory = productPrice.tax
                const norderitem = await this.connection.getRepository(OrderItem).save(newOrderItem)
                totalAmt = totalAmt + productPrice.price
                const newOrDerLine = new OrderLine()
                newOrDerLine.store = productPrice.store
                newOrDerLine.priceField = classToPlain(productPrice) as any
                newOrDerLine.stage = OrderStageType.CREATED
                newOrDerLine.item = norderitem
                const savedOrderline = await this.connection.getRepository(OrderLine).save(newOrDerLine)
                prodVars.push(savedOrderline)
            }
            neworder.line = prodVars
            neworder.totalPrice = totalAmt
            neworder.address = address
            const savedOrder = await this.connection.getRepository(Order).save(neworder)
            resolve(savedOrder)
        })
    }

    // order listeners
    async onOrderPackages(orderLineId: string, type: OrderStageType, job: Job<OrderLineJobData>): Promise<void> {
        this.workerService.send(new OrderLineMessages({lineId: orderLineId, type})).subscribe({
            next: ({lineId, type}) => {
                console.log(lineId, type)
                job.setProgress(100)
            },
            complete: () => {
                job.complete()
            },
            error: (err) => {
                Logger.error(err)
                job.fail(err)
            }
        })
    }

    applyOrderLineChanges({lineId, type}): Promise<any> {
        return new Promise(async(resolve, reject) => {
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
                                resolve({
                                    lineId: line.id,
                                    type: OrderStageType.PACKAGED
                                })
                            }).catch(err => reject(err))
                    } else if (ordered[0].length >= 10) {
                        const deliveryStranded = new DeliveryStranded()
                        deliveryStranded.orderId = lineId
                        this.connection.getRepository(DeliveryStranded)
                            .save(deliveryStranded)
                            .then(() => {
                                resolve({
                                    lineId: line.id,
                                    type: OrderStageType.PACKAGED
                                })
                            }).catch(err => reject(err))
                    } else {
                        line.pool = await this.connection.getRepository(DeliveryPool).findOne({where:{id: ordered[0].id}})
                        line.pool.save()
                            .then(() => {
                                resolve({
                                    lineId: line.id,
                                    type: OrderStageType.PACKAGED
                                })
                            }).catch(err => reject(err))
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
                                resolve({
                                    lineId: line.id,
                                    type: OrderStageType.RETURNINITIATED
                                })
                            }).catch(err => reject(err))
                    } else if (ordered[0].length >= 10) {
                        const deliveryStranded = new DeliveryStranded()
                        deliveryStranded.orderId = lineId
                        this.connection.getRepository(DeliveryStranded)
                            .save(deliveryStranded)
                            .then(() => {
                                resolve({
                                    lineId: line.id,
                                    type: OrderStageType.RETURNINITIATED
                                })
                            }).catch(err => reject(err))
                    } else {
                        line.pool = await this.connection.getRepository(DeliveryPool).findOne({where:{id: ordered[0].id}})
                        line.pool.save()
                            .then(() => {
                                resolve({
                                    lineId: line.id,
                                    type: OrderStageType.RETURNINITIATED
                                })
                            }).catch(err => reject(err))
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
                                    resolve({
                                        lineId: line.id,
                                        type: OrderStageType.DELIVERED
                                    })
                                }).catch(err => reject(err))
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
                                        resolve({
                                            lineId: line.id,
                                            type: OrderStageType.DELIVERED
                                        })
                                    }).catch(err => reject(err))

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
                                            resolve({
                                                lineId: line.id,
                                                type: OrderStageType.DELIVERED
                                            })
                                        }).catch(err => reject(err))
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
                                    resolve({
                                        lineId: line.id,
                                        type: OrderStageType.DELIVERED
                                    })
                                }).catch(err => reject(err))
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
                            resolve({
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
                    resolve({
                        lineId: line.id,
                        type: type
                    })
                }
                break;
                case OrderStageType.PROCESSED: {}
                break;
                default:{
                    resolve({
                        lineId: line.id,
                        type: type
                    })
                }
            }
        })
    }
}
