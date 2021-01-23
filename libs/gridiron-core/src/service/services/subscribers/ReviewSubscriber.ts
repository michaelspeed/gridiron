import {EntitySubscriberInterface, EventSubscriber, getConnection, InsertEvent} from "typeorm";
import {ProductVariant, Review} from "../../../entity";

@EventSubscriber()
export class ReviewSubscriber implements EntitySubscriberInterface<Review> {
    listenTo(): Function | string {
        return Review
    }

    beforeInsert(event: InsertEvent<Review>): Promise<any> | void {
        return new Promise(async (resolve, reject) => {
            const allReviews = await getConnection().getRepository(Review).find({where:{variant:{id: event.entity.variant.id}}})
            if (allReviews.length > 0) {
                const reviewArray = allReviews.map(item => item.stars)
                const avg = Math.round(reviewArray.reduce((a, b) => (a + b)) / reviewArray.length)
                const prodVar = await getConnection().getRepository(ProductVariant).findOne({where:{id: event.entity.variant.id}})
                prodVar.rating = avg
                await prodVar.save()
                resolve(event)
            } else {
                const prodVar = await getConnection().getRepository(ProductVariant).findOne({where:{id: event.entity.variant.id}})
                prodVar.rating = event.entity.stars
                await prodVar.save()
                resolve(event)
            }
        })
    }
}
