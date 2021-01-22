import {Resolver} from "@nestjs/graphql";
import {CartPrice, PromotionVariantPrice} from "../../../entity";
import {CRUDResolver, PagingStrategies} from "@nestjs-query/query-graphql";
import {InjectQueryService, QueryService} from "@nestjs-query/core";

@Resolver(of => CartPrice)
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
