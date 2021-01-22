import {Query, Resolver} from '@nestjs/graphql';
import {InjectQueryService, QueryService} from '@nestjs-query/core';
import {CountryService} from '../../../service';
import {CRUDResolver, PagingStrategies} from '@nestjs-query/query-graphql';
import {Country} from '../../../entity'


@Resolver(of => Country)
export class CountryResolver extends CRUDResolver(Country, {
    pagingStrategy: PagingStrategies.OFFSET,
    enableAggregate: true,
    aggregate: {
        enabled: true
    },
    enableSubscriptions: true
}){
    constructor(
        @InjectQueryService(Country) readonly service: QueryService<Country>,
        private readonly countryService: CountryService
    ) {
        super(service);
    }

    @Query(returns => [Country])
    async GetAllCountries(): Promise<Country[]> {
        return this.countryService.GetAllCountry()
    }
}
