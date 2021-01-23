import {Field, InputType} from "@nestjs/graphql";

@InputType({isAbstract: true})
export class CartItemDto {
    @Field()
    priceId: string

    @Field()
    quantity: number
}
