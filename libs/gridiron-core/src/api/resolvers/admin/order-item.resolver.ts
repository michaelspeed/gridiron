import {Resolver} from "@nestjs/graphql";
import {CRUDResolver, PagingStrategies} from "@nestjs-query/query-graphql";
import {InjectQueryService, QueryService} from "@nestjs-query/core";
import { OrderItem } from "@gridiron/entities";

@Resolver(() => OrderItem)
export class OrderItemResolver extends CRUDResolver(OrderItem, {
    pagingStrategy: PagingStrategies.OFFSET,
    enableAggregate: true,
    aggregate: {
        enabled: true
    },
    enableSubscriptions: true,
    create: {
        disabled: true
    },
    update: {
        disabled: true
    },
    delete: {
        disabled: true
    }
}){
    constructor(
        @InjectQueryService(OrderItem) readonly service: QueryService<OrderItem>
    ) {
        super(service);
    }
}
