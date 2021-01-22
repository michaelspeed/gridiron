import {Field, ObjectType} from "@nestjs/graphql";

@ObjectType({isAbstract: true})
export class DeliveryStrandedCount {
    @Field()
    count: number
}
