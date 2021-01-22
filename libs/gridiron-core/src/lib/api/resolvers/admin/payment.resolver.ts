import {Resolver} from "@nestjs/graphql";
import {Payment} from "../../../entity";
import {CRUDResolver, PagingStrategies} from "@nestjs-query/query-graphql";
import {InjectQueryService, QueryService} from "@nestjs-query/core";

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
