import {Resolver} from "@nestjs/graphql";
import {CRUDResolver, PagingStrategies} from "@nestjs-query/query-graphql";
import {InjectQueryService, QueryService} from "@nestjs-query/core";
import { CartPrice } from "@gridiron/entities";

@Resolver(() => CartPrice)
export class CartPriceResolver extends CRUDResolver(CartPrice, {
    pagingStrategy: PagingStrategies.OFFSET,
    enableAggregate: true,
    aggregate: {
        enabled: true
    },
    enableSubscriptions: true
}){
    constructor(
        @InjectQueryService(CartPrice) readonly service: QueryService<CartPrice>
    ) {
        super(service);
    }
}
