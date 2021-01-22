import {Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent} from 'typeorm';
import {Collection} from '../../../entity';
import {Injectable} from "@nestjs/common";
import {CollectionEvents, EventBus} from "../../../event-bus";

@Injectable()
@EventSubscriber()
export class CollectionSubscriber implements EntitySubscriberInterface<Collection>{

    constructor(
        private eventBus: EventBus,
        private readonly connection: Connection,
    ) {
        connection.subscribers.push(this)
    }

    listenTo(): Function | string {
        return Collection
    }

    afterInsert(event: InsertEvent<Collection>): Promise<any> | void {
        return new Promise(async (resolve, reject) => {
            if (event.entity) {
                this.eventBus.publish(new CollectionEvents(event.entity, 'created'))
                resolve()
            } else {
                resolve()
            }
        })
    }
}
