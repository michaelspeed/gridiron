import {Resolver} from '@nestjs/graphql';
import {ProductAsset} from '../../../entity';
import {CRUDResolver, PagingStrategies} from '@nestjs-query/query-graphql';
import {InjectQueryService, QueryService} from '@nestjs-query/core';

@Resolver(of => ProductAsset)
export class ProductAssetResolver extends CRUDResolver(ProductAsset, {
    pagingStrategy: PagingStrategies.OFFSET,
    enableAggregate: true,
    aggregate: {
        enabled: true
    },
    enableSubscriptions: true
}){
    constructor(
        @InjectQueryService(ProductAsset) readonly service: QueryService<ProductAsset>
    ) {
        super(service);
    }
}
