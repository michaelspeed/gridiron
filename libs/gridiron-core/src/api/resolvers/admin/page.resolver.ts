import {Query, Resolver} from "@nestjs/graphql";
import {CRUDResolver, PagingStrategies} from "@nestjs-query/query-graphql";
import {InjectQueryService, QueryService} from "@nestjs-query/core";
import {PageService} from "../../../service/services/admin/page.service";
import { Page } from "@gridiron/entities";

@Resolver(() => Page)
export class PageResolver extends CRUDResolver(Page, {
    pagingStrategy: PagingStrategies.OFFSET,
    enableAggregate: true,
    aggregate: {
        enabled: true
    },
    enableSubscriptions: true
}){
    constructor(
        @InjectQueryService(Page) readonly service: QueryService<Page>,
        private pageService: PageService
    ) {
        super(service);
    }

    @Query(() => Page)
    async getHomePage(): Promise<Page> {
        return this.pageService.getHomeMenu()
    }
}
