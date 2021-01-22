import {Resolver} from '@nestjs/graphql';
import {CRUDResolver, PagingStrategies} from '@nestjs-query/query-graphql';
import {QueryService} from '@nestjs-query/core';
import {InjectQueryService} from '@nestjs-query/core/dist/src/decorators';
import {TaxCategory} from '../../../entity';

@Resolver(of => TaxCategory)
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
