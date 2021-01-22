import {Args, ID, Mutation, Resolver} from '@nestjs/graphql';
import {ProductVariantAsset} from '../../../entity';
import {CRUDResolver, PagingStrategies} from '@nestjs-query/query-graphql';
import {InjectQueryService, QueryService} from '@nestjs-query/core';
import {ProductVariantsService} from '@gridiron/core/service/services/admin/product-variants.service';

@Resolver(of => ProductVariantAsset)
export class ProductVariantAssetResolver extends CRUDResolver(ProductVariantAsset, {
    create: {
        disabled: true
    },
    update: {
        disabled: true
    },
    delete: {
        disabled: true
    },
    pagingStrategy: PagingStrategies.OFFSET,
    enableAggregate: true,
    aggregate: {
        enabled: true
    },
    enableSubscriptions: true
}){
    constructor(
        @InjectQueryService(ProductVariantAsset) readonly service: QueryService<ProductVariantAsset>,
        private readonly productVariantsService: ProductVariantsService
    ) {
        super(service);
    }

    @Mutation(returns => ProductVariantAsset)
    async CreateProductVariantAsset(
        @Args('id', {type: () => ID, nullable: false}) id: string,
        @Args('assetId', {type: () => ID, nullable: false}) assetId: string,
    ): Promise<ProductVariantAsset> {
        return this.productVariantsService.updateProductVariantAsset(id, assetId)
    }
}
