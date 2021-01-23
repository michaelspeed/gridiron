import {Resolver} from '@nestjs/graphql';
import {CRUDResolver, PagingStrategies} from '@nestjs-query/query-graphql';
import {InjectQueryService, QueryService} from '@nestjs-query/core';
import { Channel } from '@gridiron/entities';

@Resolver(() => Channel)
export class ChannelsResolver extends CRUDResolver(Channel, {
    pagingStrategy: PagingStrategies.OFFSET,
    enableAggregate: true,
    aggregate: {
        enabled: true
    },
    enableSubscriptions: true
}){
    constructor(
        @InjectQueryService(Channel) readonly service: QueryService<Channel>
    ) {
        super(service);
    }
}
