import {Field, InputType, ObjectType} from "@nestjs/graphql";

@InputType({isAbstract: true})
export class OrderLineDto {
    @Field()
    priceId: string

    @Field()
    quantity: number
}
