import {Field, ObjectType} from '@nestjs/graphql';
import { AdjustmentType } from '..';

@ObjectType('Adjustment', {isAbstract: true})
export default class Adjustment {
    @Field()
    adjustmentSource: string;

    @Field()
    type: AdjustmentType

    description: string

    amount: number
}
