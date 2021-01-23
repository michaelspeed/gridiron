import {Mutation, Resolver} from '@nestjs/graphql';
import {CRUDResolver, PagingStrategies} from '@nestjs-query/query-graphql';
import {InjectQueryService, QueryService} from '@nestjs-query/core';
import {Channel} from '../../../entity';
import {PagingTypes} from '../../dto/admin/paging-types';

@Resolver(of => Channel)
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
