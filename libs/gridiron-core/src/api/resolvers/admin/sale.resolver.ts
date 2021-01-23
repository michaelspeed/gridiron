import {Resolver} from '@nestjs/graphql';
import {Sale} from '../../../entity';
import {CRUDResolver, PagingStrategies} from '@nestjs-query/query-graphql';
import {InjectQueryService, QueryService} from '@nestjs-query/core';

@Resolver(() => Sale)
export class SaleResolver extends CRUDResolver(Sale, {
    pagingStrategy: PagingStrategies.OFFSET,
    enableAggregate: true,
    aggregate: {
        enabled: true
    },
    enableSubscriptions: true
}){
    constructor(
        @InjectQueryService(Sale) readonly service: QueryService<Sale>
    ) {
        super(service);
    }
}
