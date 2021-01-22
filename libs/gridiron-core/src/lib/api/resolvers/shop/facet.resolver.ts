import {Args, ID, Query, Resolver} from "@nestjs/graphql";
import {Facet, FacetValue, Product} from "../../../entity";
import {ShopFacetService} from "../../../service";

@Resolver(() => Facet)
export class SearchFacetResolver {
    constructor(
        private readonly shopFacetService: ShopFacetService
    ) {}

    @Query(() => [Product])
    async queryFacet(
        @Args('id', {type: () => ID}) id: string,
        @Args('collection', {type: () => ID, nullable: true}) collection: string,
    ): Promise<Product[]> {
        return this.shopFacetService.facetPageService(id, collection)
    }

    @Query(() => FacetValue)
    async GetFacetDocument(
        @Args('id', {type: () => ID}) id: string,
    ): Promise<FacetValue>{
        return this.shopFacetService.getFacetInfo(id)
    }
}
