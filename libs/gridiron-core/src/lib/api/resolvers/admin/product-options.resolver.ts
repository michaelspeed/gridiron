import {Resolver} from '@nestjs/graphql';
import {ProductOption} from '../../../entity';
import {CRUDResolver, PagingStrategies} from '@nestjs-query/query-graphql';
import {InjectQueryService, QueryService} from '@nestjs-query/core';

@Resolver(of => ProductOption)
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
