import {Args, ID, Mutation, Resolver} from '@nestjs/graphql';
import {Product} from '../../../entity';
import {CRUDResolver, PagingStrategies} from '@nestjs-query/query-graphql';
import {InjectQueryService, QueryService} from '@nestjs-query/core';
import {ProductService} from '@gridiron/core/service/services/admin/product.service';

@Resolver(of => Product)
export class ProductResolver extends CRUDResolver(Product, {
    pagingStrategy: PagingStrategies.OFFSET,
    enableAggregate: true,
    aggregate: {
        enabled: true
    },
    enableSubscriptions: true
}){
    constructor(
        @InjectQueryService(Product) readonly service: QueryService<Product>,
        private readonly productService: ProductService
    ) {
        super(service);
    }

    @Mutation(() => Product)
    async CreateProduct(
        @Args('name', {type: () => String}) name: string,
        @Args('desc', {type: () => String}) desc: string,
        @Args('slug', {type: () => String}) slug: string,
        @Args('featured', {type: () => String}) featured: string,
        @Args('asset', {type: () => [String]}) asset: string[],
        @Args('facet', {type: () => [String]}) facet: string[],
    ): Promise<Product> {
        return this.productService.createProduct(name, desc, slug, asset, facet, featured)
    }

    @Mutation(() => Product)
    async UpdateProductCollection(
        @Args('id', {type: () => ID!}) id: string,
        @Args('collectionId', {type: () => ID!}) collectionId: string,
    ): Promise<Product> {
        return this.productService.updateProductCollection(id, collectionId)
    }

    @Mutation(() => Product)
    async updateProduct(
        @Args('name', {type: () => String}) name: string,
        @Args('desc', {type: () => String}) desc: string,
        @Args('id', {type: () => ID}) id: string,
        @Args('featured', {type: () => String}) featured: string,
        @Args('asset', {type: () => [String]}) asset: string[],
        @Args('facet', {type: () => [String]}) facet: string[],
        @Args('viewcode', {type: () => [String]}) viewcode: string[],
    ): Promise<Product> {
        return this.productService.updateProduct(id, name, desc, asset, facet, featured, viewcode)
    }
}
