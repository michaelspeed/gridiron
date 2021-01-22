import {Args, ID, Query, Resolver} from "@nestjs/graphql";
import {DataSource, StatisticeDto, StatisticeProdDto} from "../../dto/admin/statistice.dto";
import {StatisticsService} from "../../../service";

@Resolver(() => StatisticeDto)
export class StatisticResolver {
    constructor(
        private readonly statisticService: StatisticsService
    ) {}

    @Query(() => StatisticeDto)
    async GetProductSaleData(
        @Args('productId', {type: () => ID}) productId: string,
        @Args('type') type: string,
        @Args('storeId', {nullable: true}) storeId: string,
    ): Promise<StatisticeDto> {
        return this.statisticService.getProductStatistics(productId, type, storeId)
    }

    @Query(() => StatisticeDto)
    async GetStoreOrderData(
        @Args('type') type: string,
        @Args('storeId') storeId: string,
    ): Promise<StatisticeDto> {
        return this.statisticService.getStoreOrderStatistics(storeId, type)
    }

    @Query(() => StatisticeDto)
    async GetAdminOrderData(
        @Args('type') type: string,
    ): Promise<StatisticeDto> {
        return this.statisticService.getAdminOrderStatistics(type)
    }

    @Query(() => StatisticeProdDto)
    async GetProductViews(
        @Args('productId', {type: () => ID}) productId: string,
        @Args('type', {nullable: true}) type: string,
    ): Promise<StatisticeProdDto> {
        return this.statisticService.getProductViews(productId, type)
    }

    @Query(() => StatisticeProdDto)
    async GetAdminViews(
        @Args('type', {nullable: true}) type: string,
    ): Promise<StatisticeProdDto> {
        return this.statisticService.getAdminViews(type)
    }
}
