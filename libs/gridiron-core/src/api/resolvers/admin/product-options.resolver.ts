import {Resolver} from '@nestjs/graphql';
import {CRUDResolver, PagingStrategies} from '@nestjs-query/query-graphql';
import {InjectQueryService, QueryService} from '@nestjs-query/core';
import { ProductOption } from '@gridiron/entities';

@Resolver(() => ProductOption)
export class ProductOptionsResolver extends CRUDResolver(ProductOption, {
    pagingStrategy: PagingStrategies.OFFSET,
    enableAggregate: true,
    aggregate: {
        enabled: true
    },
    enableSubscriptions: true
}){
    constructor(
        @InjectQueryService(ProductOption) readonly service: QueryService<ProductOption>
    ) {
        super(service);
    }
}
