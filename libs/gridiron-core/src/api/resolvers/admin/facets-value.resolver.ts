import {Resolver} from '@nestjs/graphql';
import {CRUDResolver, PagingStrategies} from '@nestjs-query/query-graphql';
import {InjectQueryService, QueryService} from '@nestjs-query/core';
import {FacetValue} from '../../../entity';

@Resolver(of => FacetValue)
export class FacetsValueResolver extends CRUDResolver(FacetValue, {
    pagingStrategy: PagingStrategies.OFFSET,
    enableAggregate: true,
    aggregate: {
        enabled: true
    },
    enableSubscriptions: true
}){
    constructor(
        @InjectQueryService(FacetValue) readonly service: QueryService<FacetValue>
    ) {
        super(service);
    }
}
