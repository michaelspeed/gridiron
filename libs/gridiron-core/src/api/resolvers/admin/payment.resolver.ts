import {Resolver} from "@nestjs/graphql";
import {CRUDResolver, PagingStrategies} from "@nestjs-query/query-graphql";
import {InjectQueryService, QueryService} from "@nestjs-query/core";
import { Payment } from "@gridiron/entities";

@Resolver(() => Payment)
export class PaymentResolver extends CRUDResolver(Payment, {
    pagingStrategy: PagingStrategies.OFFSET,
    enableAggregate: true,
    aggregate: {
        enabled: true
    },
    enableSubscriptions: true,
    create:{
        disabled: true
    },
    update:{
        disabled: true
    },
    delete:{
        disabled: true
    }
}) {
    constructor(
        @InjectQueryService(Payment) readonly service: QueryService<Payment>
    ) {
        super(service);
    }
}
