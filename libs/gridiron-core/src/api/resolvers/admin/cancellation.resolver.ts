import {Resolver} from '@nestjs/graphql';
import {CRUDResolver, PagingStrategies} from '@nestjs-query/query-graphql';
import {InjectQueryService, QueryService} from '@nestjs-query/core';
import { Cancellation } from '@gridiron/entities';

@Resolver(() => Cancellation)
export class CancellationResolver extends CRUDResolver(Cancellation, {
    pagingStrategy: PagingStrategies.OFFSET,
    enableAggregate: true,
    aggregate: {
        enabled: true
    },
    enableSubscriptions: true
}){
    constructor(
        @InjectQueryService(Cancellation) readonly service: QueryService<Cancellation>
    ) {
        super(service);
    }
}
