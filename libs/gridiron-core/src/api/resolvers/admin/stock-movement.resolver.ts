import {Resolver} from '@nestjs/graphql';
import {CRUDResolver, PagingStrategies} from '@nestjs-query/query-graphql';
import {InjectQueryService, QueryService} from '@nestjs-query/core';
import { StockMovement } from '@gridiron/entities';

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
