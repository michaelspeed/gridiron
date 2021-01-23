import {Resolver} from '@nestjs/graphql';
import {Facet} from '../../../entity';
import {CRUDResolver, PagingStrategies} from '@nestjs-query/query-graphql';
import {InjectQueryService, QueryService} from '@nestjs-query/core';

@Resolver(of => Facet)
export class FacetsResolver extends CRUDResolver(Facet, {
    pagingStrategy: PagingStrategies.OFFSET,
    enableAggregate: true,
    aggregate: {
        enabled: true
    },
    enableSubscriptions: true
}){
    constructor(
        @InjectQueryService(Facet) readonly service: QueryService<Facet>
    ) {
        super(service);
    }
}
