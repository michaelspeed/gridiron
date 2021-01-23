import {Query, Resolver} from '@nestjs/graphql';
import {CRUDResolver, PagingStrategies} from '@nestjs-query/query-graphql';
import {InjectQueryService, QueryService} from '@nestjs-query/core';
import {TaxCategory, TaxRate} from '../../../entity';
import {TaxCategoryService} from '../../../service';

@Resolver(of => TaxRate)
export class TaxRatesResolver extends CRUDResolver(TaxRate, {
    pagingStrategy: PagingStrategies.OFFSET,
    enableAggregate: true,
    aggregate: {
        enabled: true
    },
    enableSubscriptions: true
}){
    constructor(
        @InjectQueryService(TaxRate) readonly service: QueryService<TaxRate>,
        private readonly taxCatService: TaxCategoryService
    ) {
        super(service);
    }

    @Query(() => [TaxRate])
    async GetAllTaxRates(): Promise<TaxRate[]> {
        return this.taxCatService.getAllTaxRates()
    }

    @Query(() => [TaxCategory])
    async GetAllTaxCategory(): Promise<TaxCategory[]> {
        return this.taxCatService.getAllTaxRule()
    }
}
