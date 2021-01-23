import {EntitySubscriberInterface, EventSubscriber, getConnection, UpdateEvent} from "typeorm";
import {StockBackLog, StockKeeping} from "../../../entity";

@EventSubscriber()
export class StockSubscriber implements EntitySubscriberInterface<StockKeeping> {
    listenTo(): Function | string {
        return StockKeeping
    }

    afterUpdate(event: UpdateEvent<StockKeeping>): Promise<any> | void {
        return new Promise(async (resolve, reject) => {
            if (event.entity) {
                const stock = await getConnection().getRepository(StockKeeping).findOne({where:{id: event.entity.id}, relations:['variant', 'store']})
                const stockBackLog = await getConnection().getRepository(StockBackLog).findOne({where:{variant: {id: stock.variant.id}, store:{id: stock.store.id}}})
                if (stockBackLog) {
                    if ((stock.quantity - stockBackLog.quantity )> 0) {
                        stockBackLog.remove().then(value => resolve(stock)).catch(error => resolve(stock))
                    } else {
                        stockBackLog.quantity = stockBackLog.quantity - stock.quantity
                        stockBackLog.save().then(value => {
                            resolve(stock)
                        }).catch(error => resolve(stock))
                    }
                }
            }
        })
    }
}
