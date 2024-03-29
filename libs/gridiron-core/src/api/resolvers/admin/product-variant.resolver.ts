import {Args, ID, Mutation, Resolver} from '@nestjs/graphql';
import {CRUDResolver, PagingStrategies} from '@nestjs-query/query-graphql';
import {InjectQueryService, QueryService} from '@nestjs-query/core';
import {ProductVariantsService} from '../../../service/services/admin/product-variants.service';
import GraphQLJSON from 'graphql-type-json';
import { ProductVariant, ProductVariantSpecifications } from '@gridiron/entities';

@Resolver(() => ProductVariant)
export class ProductVariantResolver extends CRUDResolver(ProductVariant, {
    pagingStrategy: PagingStrategies.OFFSET,
    enableAggregate: true,
    aggregate: {
        enabled: true
    },
    enableSubscriptions: true,
    create: {
        disabled: true
    },
    update: {
        disabled: true
    }
}){
    constructor(
        @InjectQueryService(ProductVariant) readonly service: QueryService<ProductVariant>,
        private productVariantsService: ProductVariantsService
    ) {
        super(service);
    }

    @Mutation(() => [ProductVariant])
    async CreateProductVariants(
        @Args({name: 'prodId', type: () => ID}) prodId: string,
        @Args('options') options: string,
    ): Promise<ProductVariant[]> {
        return this.productVariantsService.createProductOptions(prodId, JSON.parse(options))
    }

    @Mutation(() => ProductVariantSpecifications)
    async CreateProductVariantSpecification(
        @Args({name: 'variantId', type: () => ID}) variantId: string,
        @Args({name: 'specs', type: () => GraphQLJSON}) specs: any,
    ): Promise<ProductVariantSpecifications> {
        return this.productVariantsService.createProductVariantSpecs(variantId, specs)
    }

    @Mutation(() => ProductVariantSpecifications)
    async UpdateProductVariantSpecification(
        @Args({name: 'id', type: () => ID}) id: string,
        @Args({name: 'specs', type: () => GraphQLJSON}) specs: any,
    ): Promise<ProductVariantSpecifications> {
        return this.productVariantsService.updateProductVariantSpecs(id, specs)
    }

    @Mutation(() => ProductVariant)
    async UpdateVariantViewCode(
        @Args({name: 'variantId', type: () => ID}) id: string,
        @Args({name: 'viewcode', type: () => [String]}) viewcode: string[],
    ): Promise<ProductVariant> {
        return this.productVariantsService.updateVariantViewCodes(id, viewcode)
    }
}
