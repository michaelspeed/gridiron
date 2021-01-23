import {Args, ID, Int, Query, Resolver} from "@nestjs/graphql";
import {Collection, FacetValue, ProductVariant} from "../../../entity";
import {ShopCollectionService} from "../../../service";
import {CollectionSingleResponse} from "../../dto/shop/CollectionSingleResponse";

@Resolver(of => Collection)
export class ShopCollectionResolver {
    constructor(
        private readonly collectionService: ShopCollectionService
    ) {}

    @Query(() => [Collection])
    async getAllCollection(): Promise<Collection[]> {
        return this.collectionService.getCollections()
    }

    @Query(() => [Collection])
    async GetCollectionTree(): Promise<Collection[]> {
        return this.collectionService.GetCollectionTree()
    }

    @Query(() => CollectionSingleResponse)
    async GetSingleCollection(
        @Args('id', {type: () => ID}) id: string,
    ): Promise<CollectionSingleResponse> {
        return new Promise(async (resolve, reject) => {
            const singleCol = await this.collectionService.GetSingleCollection(id)
            resolve({
                collection: singleCol,
                facetValues: []
            })
        })
    }

    @Query(() => [FacetValue])
    async GetFacetsByCollection(
        @Args('id', {type: () => ID}) id: string,
    ): Promise<FacetValue[]> {
        return this.collectionService.GetCollectionFacets(id)
    }

    @Query(() => [ProductVariant])
    async GetProductVariantForCollection(
        @Args('id', {type: () => ID}) id: string,
        @Args('limit', {nullable: true, type: () => Int}) limit: number,
        @Args('search', {nullable: true, type: () => String}) search: string,
    ): Promise<ProductVariant[]> {
        return this.collectionService.GetAllProductForCollection(id, limit, search)
    }

    @Query(() => [ProductVariant])
    async GetAllProdsWithPriceRangeAndFacet(
        @Args('id', {type: () => ID}) id: string,
        @Args('facetIds', {type: () => [String]}) facetIds: string[],
        @Args('start', {nullable: true, type: () => Int}) start: number,
        @Args('last', {nullable: true, type: () => Int}) last: number,
        @Args('search', {nullable: true, type: () => String}) search: string,
    ): Promise<ProductVariant[]> {
        return this.collectionService.GetAllProdsWithPriceRangeAndFacet(id, facetIds, start, last, search)
    }
}
