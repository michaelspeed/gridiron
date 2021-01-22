import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType('FocalPoint', {isAbstract: true})
export class FocalPoint {
    @Field()
    x: number

    @Field()
    y: number
}
