import {Resolver} from '@nestjs/graphql';
import {CRUDResolver, PagingStrategies} from '@nestjs-query/query-graphql';
import {InjectQueryService, QueryService} from '@nestjs-query/core';
import { TaxCategory } from '@gridiron/entities';

@Resolver(() => TaxCategory)
export class TaxCategoryResolver extends CRUDResolver(TaxCategory, {
    pagingStrategy: PagingStrategies.OFFSET,
    enableAggregate: true,
    aggregate: {
        enabled: true
    },
    enableSubscriptions: true
}){
    constructor(
        @InjectQueryService(TaxCategory) readonly service: QueryService<TaxCategory>
    ) {
        super(service);
    }
}
