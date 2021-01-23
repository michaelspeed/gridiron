import {Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent} from 'typeorm';
import {Injectable} from "@nestjs/common";
import {CollectionEvents, EventBus} from "../../../event-bus";
import { Collection } from '@gridiron/entities';

@Injectable()
@EventSubscriber()
export class CollectionSubscriber implements EntitySubscriberInterface<Collection>{

    constructor(
        private eventBus: EventBus,
        private readonly connection: Connection,
    ) {
        connection.subscribers.push(this)
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    listenTo(): Function | string {
        return Collection
    }

    afterInsert(event: InsertEvent<Collection>): Promise<any> | void {
        return new Promise<void>(async (resolve) => {
            if (event.entity) {
                this.eventBus.publish(new CollectionEvents(event.entity, 'created'))
                resolve()
            } else {
                resolve()
            }
        })
    }
}
