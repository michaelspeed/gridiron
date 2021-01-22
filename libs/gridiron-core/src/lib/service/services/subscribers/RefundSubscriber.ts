import {EntitySubscriberInterface, EventSubscriber, getConnection, UpdateEvent} from "typeorm";
import {OrderLine, Refund} from "../../../entity";
import {OrderStageType, RefundEnum} from "../../../enums";

@EventSubscriber()
export class RefundSubscriber implements EntitySubscriberInterface<Refund> {
    listenTo(): Function | string {
        return Refund
    }

    afterUpdate(event: UpdateEvent<Refund>): Promise<any> | void {
        return new Promise(async (resolve, reject) => {
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
