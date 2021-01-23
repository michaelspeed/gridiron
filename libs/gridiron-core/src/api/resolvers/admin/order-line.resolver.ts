import {Resolver} from "@nestjs/graphql";
import {CRUDResolver, PagingStrategies} from "@nestjs-query/query-graphql";
import {InjectQueryService, QueryService} from "@nestjs-query/core";
import { OrderLine } from "@gridiron/entities";

@Resolver(() => OrderLine)
export class OrderLineResolver extends CRUDResolver(OrderLine, {
    pagingStrategy: PagingStrategies.OFFSET,
    enableAggregate: true,
    aggregate: {
        enabled: true
    },
    enableSubscriptions: true,
    create: {
        disabled: true
    },
    delete: {
        disabled: true
    }
}){
    constructor(
        @InjectQueryService(OrderLine) readonly service: QueryService<OrderLine>
    ) {
        super(service);
    }
}
