import { Page } from "@gridiron/entities";
import {Query, Resolver} from "@nestjs/graphql";
import {ShopPagesService} from "../../../service";

@Resolver(() => Page)
export class ShopPageResolver {
    constructor(
        private readonly shopPagesService: ShopPagesService
    ) {}

    @Query(() => Page)
    async getHomePage(): Promise<Page> {
        return this.shopPagesService.getHomePageData()
    }
}
