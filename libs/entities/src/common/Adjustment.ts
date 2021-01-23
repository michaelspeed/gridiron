import {AdjustmentType} from '../../enums/AdjustmentType';
import {Field, ObjectType} from '@nestjs/graphql';
import {FilterableField} from '@nestjs-query/query-graphql';

@ObjectType('Adjustment', {isAbstract: true})
export default class Adjustment {
    @Field()
    adjustmentSource: string;

    @Field()
    type: AdjustmentType

    description: string

    amount: number
}
