import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {CRUDResolver, PagingStrategies} from '@nestjs-query/query-graphql';
import {InjectQueryService, QueryService} from '@nestjs-query/core';
import {Country, Store} from '../../../entity';
import {StoreService} from '../../../service/services/admin/store.service';

@Resolver(of => Store)
export class StoreResolver extends CRUDResolver(Store, {
    pagingStrategy: PagingStrategies.OFFSET,
    enableAggregate: true,
    aggregate: {
        enabled: true
    },
    enableSubscriptions: true
}){
    constructor(
        @InjectQueryService(Store) readonly service: QueryService<Store>,
        private readonly storeService: StoreService
    ) {
        super(service);
    }

    @Query(returns => Store, {nullable: true})
    async GetDefaultStore(): Promise<Store> {
        return this.storeService.GetDefaultStore()
    }

    @Mutation(returns => Store)
    async CreateDefaultStore(
        @Args('storeName') storeName: string,
        @Args('phoneNumber') phoneNumber: string,
        @Args('officialemail') officialemail: string,
        @Args('GSTIN') GSTIN: string,
        @Args('streetAddress1') streetAddress1: string,
        @Args('streetAddress2') streetAddress2: string,
        @Args('zipcode') zipcode: string,
        @Args('countryId') countryId: string,
    ): Promise<Store> {
        return this.storeService.CreateDefaultStore(storeName, phoneNumber, officialemail, GSTIN, streetAddress1, streetAddress2, zipcode, countryId)
    }
}
