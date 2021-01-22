import {EntitySubscriberInterface, EventSubscriber, InsertEvent} from 'typeorm';
import {Zip} from '@gridiron/core';
import axios from 'axios'

@EventSubscriber()
export class ZipSubscriber implements EntitySubscriberInterface<Zip>{

    listenTo(): Function | string {
        return Zip
    }

    beforeInsert(event: InsertEvent<Zip>): Promise<any> | void {
        return new Promise((resolve, reject) => {
            const url = `https://api.postalpincode.in/pincode/${event.entity.code}`
            axios.get(url).then(value => {
                event.entity.name = value.data[0].PostOffice[0].District
                event.entity.slug = JSON.stringify(value.data[0].PostOffice)
                resolve(event)
            })
        })
    }
}
