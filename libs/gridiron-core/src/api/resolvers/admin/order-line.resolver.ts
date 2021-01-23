import {Resolver} from "@nestjs/graphql";
import {OrderLine} from "../../../entity";
import {CRUDResolver, PagingStrategies} from "@nestjs-query/query-graphql";
import {InjectQueryService, QueryService} from "@nestjs-query/core";

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
