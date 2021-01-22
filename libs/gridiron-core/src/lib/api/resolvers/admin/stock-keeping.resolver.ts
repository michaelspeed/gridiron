import {StockKeeping} from '../../../entity';
import {Args, Context, ID, Mutation, Query, Resolver} from '@nestjs/graphql';
import {CRUDResolver, PagingStrategies} from '@nestjs-query/query-graphql';
import {InjectQueryService, QueryService} from '@nestjs-query/core';
import {StockKeepingType} from '../../../enums/StockKeepingType';
import {StocksService, VendorService} from '../../../service';
import {JwtService} from '@nestjs/jwt';

@Resolver(() => StockKeeping)
export class StockKeepingResolver extends CRUDResolver(StockKeeping, {
    create: {
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
        @InjectQueryService(StockKeeping) readonly service: QueryService<StockKeeping>,
        private stockService: StocksService,
        private jwtService: JwtService,
        private vendorService: VendorService
    ) {
        super(service);
    }

    @Mutation(() => StockKeeping)
    async createOrUpdateStock(
        @Args('quantity') quantity: number,
        @Args('threshold') threshold: number,
        @Args('sku') sku: string,
        @Args('multiple') multiple: boolean,
        @Args('backorder') backorder: boolean,
        @Args('stockstatus') stockstatus: boolean,
        @Args('variantId', {type: () => ID, nullable: true}) variantId: string,
        @Args('storeId', {type: () => ID, nullable: true}) storeId: string,
        @Args('stockId', {type: () => ID, nullable: true}) stockId: string,
        @Args('type', {type: () => StockKeepingType, nullable: true}) type: StockKeepingType,
    ): Promise<StockKeeping> {
        return this.stockService.createOrUpdateStock(quantity, threshold, multiple, backorder, stockstatus, sku, variantId, storeId, stockId, type)
    }

    @Query(() => StockKeeping, {nullable: true})
    async getStockKeepingVendor(
        @Args('variantId', {type: () => ID}) variantId: string,
        @Args('vendorId', {type: () => ID, nullable: true}) vendorId: string,
    ): Promise<StockKeeping> {
        return this.stockService.getStockVariantWithVendor(variantId, vendorId)
    }

    @Query(() => [StockKeeping])
    async getStockKeepingByStore(
        @Context() context
    ): Promise<StockKeeping[]> {
        const auth = context.req.headers.authorization;
        const token = auth.split(' ')[1];
        const admin: any = this.jwtService.decode(token)
        const vendor = await this.vendorService.findOneVendor(admin.userId)
        if (vendor) {
            return this.stockService.getStocksForStore(vendor.store.id)
        } else {
            return this.stockService.getStocksForStore()
        }
    }
}
