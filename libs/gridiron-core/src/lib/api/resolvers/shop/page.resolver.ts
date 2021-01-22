import {Query, Resolver} from "@nestjs/graphql";
import {Page} from "../../../entity";
import {ShopPagesService} from "../../../service";

@Resolver(of => Page)
export class ShopPageResolver {
    constructor(
        private readonly shopPagesService: ShopPagesService
    ) {}

    @Query(() => Page)
    async getHomePage(): Promise<Page> {
        return this.shopPagesService.getHomePageData()
    }
}
