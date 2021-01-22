import {Injectable, OnModuleInit} from "@nestjs/common";
import {InjectConnection} from "@nestjs/typeorm";
import {Connection} from "typeorm";
import {Order, OrderItem, OrderLine, ProductVariantPrice, User} from "../../../entity";
import {EventBus} from "../../../event-bus";
import {OrderLineDto} from "../../../api/dto/admin/OrderLineDto";
import {classToPlain} from "class-transformer";
import {OrderLineEvents} from "../../../event-bus";
import {merge} from "rxjs";
import {debounceTime} from "rxjs/operators";
import { OrderStageType } from "../../../enums";
import {Job, JobQueue, JobQueueService, OrderLineJobData, OrderLineMessages} from "../../../job-queue";
import {WorkerService} from "../../../worker";
import {Logger} from '../../../config/logger/GridIronLogger'

@Injectable()
export class OrderService implements OnModuleInit {

    private applyOrderQueue: JobQueue<OrderLineJobData>

    constructor(
        @InjectConnection() private connection: Connection,
        private eventBus: EventBus,
        private jobQueueService: JobQueueService,
        private workerService: WorkerService
    ) {}

    onModuleInit() {
        const orderLineEvents$ = this.eventBus.ofType(OrderLineEvents)
        merge(orderLineEvents$)
            .pipe(debounceTime(50))
            .subscribe(async (event) => {
                this.applyOrderQueue.add({
                    lineId: event.orderLine.id,
                    type: event.type
                })
            })

        this.applyOrderQueue = this.jobQueueService.createQueue({
            name: 'ApplyOrderLine',
            concurrency: 1,
            process: async (job) => {
                this.onOrderPackages(job.data.lineId, job.data.type, job)
            }
        })
    }

    async createOrder(userId: string, priceIds: OrderLineDto[], address: string): Promise<Order> {
        return new Promise(async (resolve, reject) => {
            console.log(userId, priceIds, address)
            const neworder = new Order()
            neworder.user = await this.connection.getRepository(User).findOne({id: userId})
            let prodVars: OrderLine[] = []
            let totalAmt = 0
            for (const prices of priceIds) {
                const productPrice = await this.connection.getRepository(ProductVariantPrice).findOne({where:{id: prices.priceId}, relations: ['variant', 'tax', 'store']})
                const stringPrice = JSON.stringify(productPrice)
                console.log(productPrice)
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
}
