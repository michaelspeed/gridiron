import {Resolver} from '@nestjs/graphql';
import {CRUDResolver, PagingStrategies} from '@nestjs-query/query-graphql';
import {InjectQueryService, QueryService} from '@nestjs-query/core';
import { ProductOptionGroup } from '@gridiron/entities';

@Resolver(() => ProductOptionGroup)
export class ProductOptionGroupResolver extends CRUDResolver(ProductOptionGroup, {
    pagingStrategy: PagingStrategies.OFFSET,
    enableAggregate: true,
    aggregate: {
        enabled: true
    },
    enableSubscriptions: true
}){
    constructor(
        @InjectQueryService(ProductOptionGroup) readonly service: QueryService<ProductOptionGroup>
    ) {
        super(service);
    }
}
