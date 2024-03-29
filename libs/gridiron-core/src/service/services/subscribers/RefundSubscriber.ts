import { Refund, RefundEnum, OrderLine, OrderStageType } from "@gridiron/entities";
import {EntitySubscriberInterface, EventSubscriber, getConnection, UpdateEvent} from "typeorm";

@EventSubscriber()
export class RefundSubscriber implements EntitySubscriberInterface<Refund> {
    // eslint-disable-next-line @typescript-eslint/ban-types
    listenTo(): Function | string {
        return Refund
    }

    afterUpdate(event: UpdateEvent<Refund>): Promise<any> | void {
        return new Promise(async (resolve) => {
            if (event.entity) {
                if (event.entity.stage === RefundEnum.REFUNDED) {
                    const line = await getConnection().getRepository(OrderLine).findOne({where:{refund:{id: event.entity.id}}})
                    line.stage = OrderStageType.RETURNEDREFUNDED
                    await line.save()
                    resolve(event.entity)
                }
            }
        })
    }
}
