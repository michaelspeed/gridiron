import {Resolver} from '@nestjs/graphql';
import {ProductOptionGroup} from '../../../entity';
import {CRUDResolver, PagingStrategies} from '@nestjs-query/query-graphql';
import {InjectQueryService, QueryService} from '@nestjs-query/core';

@Resolver(of => ProductOptionGroup)
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
