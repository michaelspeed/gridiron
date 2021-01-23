import {Args, Context, Mutation, Query, Resolver} from "@nestjs/graphql";
import {Search} from "../../../entity";
import {ShopSearchService} from "../../../service";

@Resolver(() => Search)
export class ShopSearchResolver {
    constructor(
        private readonly shopSearchService: ShopSearchService
    ) {}

    @Mutation(() => Search)
    async RegisterSearch(
        @Args('search') search: string,
        @Context() context
    ): Promise<Search> {
        const auth = context.req.headers.authorization;
        const token = auth.split(' ')[1];
        return this.shopSearchService.registerSearch(token, search)
    }

    @Query(() => [Search])
    async GetAllSearch(
        @Context() context
    ): Promise<Search[]> {
        const auth = context.req.headers.authorization;
        const token = auth.split(' ')[1];
        return this.shopSearchService.getAllSearch(token)
    }
}
