import {Connection, EntitySubscriberInterface, EventSubscriber, UpdateEvent} from "typeorm";
import * as _ from 'lodash';
import {EventBus, OrderLineProcessedEvent} from "../../../event-bus";
import {OrderLineEvents} from "../../../event-bus";
import {Injectable} from "@nestjs/common";
import { OrderLine, OrderStageType } from "@gridiron/entities";


@Injectable()
@EventSubscriber()
export class OrderLineSubscriber implements EntitySubscriberInterface<OrderLine>{

    constructor(
        private eventBus: EventBus,
        private readonly connection: Connection,
    ) {
        connection.subscribers.push(this)
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    listenTo(): Function | string {
        return OrderLine
    }

    afterUpdate(event: UpdateEvent<OrderLine>): Promise<any> | void {
        return new Promise<void>(async (resolve) => {
            if (event.entity) {
                this.eventBus.publish(new OrderLineEvents(event.entity, event.entity.stage))
                switch (event.entity.stage) {
                    case OrderStageType.PROCESSED: {
                        const olLine = await this.connection.getRepository(OrderLine).findOne({where:{id: event.entity.id}, relations: ['order', 'order.user']})
                        this.eventBus.publish(new OrderLineProcessedEvent(olLine, olLine.order.user))
                    }
                    break;
                }
                /*switch (event.entity.stage) {
                    case OrderStageType.PACKAGED: {
                        const deliverySignIns = await getConnection().getRepository(DeliverySignIn)
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
                            deliveryStranded.orderId = event.entity.id
                            getConnection().getRepository(DeliveryStranded)
                                .save(deliveryStranded)
                                .then(value => resolve(value))
                        } else if (ordered[0].length >= 10) {
                            const deliveryStranded = new DeliveryStranded()
                            deliveryStranded.orderId = event.entity.id
                            getConnection().getRepository(DeliveryStranded)
                                .save(deliveryStranded)
                                .then(value => resolve(value))
                        } else {
                            event.entity.pool = await getConnection().getRepository(DeliveryPool).findOne({where:{id: ordered[0].id}})
                            event.entity.save()
                                .then(value => resolve(value))
                        }
                    }
                    break;
                    case OrderStageType.DELIVERED: {
                        const line = await getConnection().getRepository(OrderLine).findOne({where:{id: event.entity.id}, relations:['item', 'item.productVariant', 'Store']})
                        const newInvoice = new Invoice()
                        newInvoice.line = line
                        newInvoice.type = InvoiceEnum.CONSUMER
                        await newInvoice.save()
                            .then(value => resolve())
                    }
                    break;
                    default: {
                        resolve()
                    }
                    break;
                }*/
                resolve()
            } else {
                resolve()
            }
        })
    }
}
