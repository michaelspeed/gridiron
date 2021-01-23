import {Resolver} from '@nestjs/graphql';
import {StockMovement} from '../../../entity';
import {CRUDResolver, PagingStrategies} from '@nestjs-query/query-graphql';
import {InjectQueryService, QueryService} from '@nestjs-query/core';

@Resolver(() => StockMovement)
export class StockMovementResolver extends CRUDResolver(StockMovement, {
    pagingStrategy: PagingStrategies.OFFSET,
    enableAggregate: true,
    aggregate: {
        enabled: true
    },
    enableSubscriptions: true
}){
    constructor(
        @InjectQueryService(StockMovement) readonly service: QueryService<StockMovement>
    ) {
        super(service);
    }
}
