import {Args, ID, Mutation, Query, Resolver} from '@nestjs/graphql';
import {CRUDResolver, PagingStrategies} from '@nestjs-query/query-graphql';
import {InjectQueryService, QueryService} from '@nestjs-query/core';
import {Zone} from '../../../entity';
import {ZoneService} from '../../../service/';

@Resolver(of => Zone)
export class ZoneResolver extends CRUDResolver(Zone, {
    pagingStrategy: PagingStrategies.OFFSET,
    enableAggregate: true,
    aggregate: {
        enabled: true
    },
    enableSubscriptions: true
}){
    constructor(
        @InjectQueryService(Zone) readonly service: QueryService<Zone>,
        private readonly zoneService: ZoneService
    ) {
        super(service);
    }

    @Query(() => [Zone])
    async ZoneFindMany(): Promise<Zone[]> {
        return this.zoneService.FindAll()
    }

    @Query(() => Zone)
    async ZoneFindOne(
        @Args({name: 'id', type: () => ID}) id: string,
    ): Promise<Zone> {
        return this.zoneService.FindOne(id)
    }

    @Mutation(() => Zone)
    async AddCountryToZone(
        @Args({name: 'id', type: () => ID}) id: string,
        @Args({name: 'countryId', type: () => ID}) countryId: string,
    ): Promise<Zone> {
        return this.zoneService.AddCountryToZone(id, countryId)
    }
}
