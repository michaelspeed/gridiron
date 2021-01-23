import {ArgsType, Field, ID, ObjectType} from '@nestjs/graphql';

@ArgsType()
export class ProductOptionsDto {
    @Field()
    optionname: string

    @Field()
    optionTags: string[]
}

@ArgsType()
export class ProductOptionsInputDto {
    @Field(() => ID)
    productId: string

    @Field(() => [ProductOptionsDto])
    ProductOptions: ProductOptionsDto[]
}
