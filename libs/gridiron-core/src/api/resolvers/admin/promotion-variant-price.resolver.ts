import {Context, Query, Resolver} from "@nestjs/graphql";
import {ProductVariantPrice, PromotionVariantPrice} from "../../../entity";
import {CRUDResolver, PagingStrategies} from "@nestjs-query/query-graphql";
import {InjectQueryService, QueryService} from "@nestjs-query/core";
import {PromotionPriceVariantService} from "../../../service/services/admin/promotion-price-variant.service";
import {JwtService} from "@nestjs/jwt";

@Resolver(of => PromotionVariantPrice)
export class PromotionVariantPriceResolver extends CRUDResolver(PromotionVariantPrice, {
    pagingStrategy: PagingStrategies.OFFSET,
    enableAggregate: true,
    aggregate: {
        enabled: true
    },
    enableSubscriptions: true
}){
    constructor(
        @InjectQueryService(PromotionVariantPrice) readonly service: QueryService<PromotionVariantPrice>,
        private readonly promotionPriceVariantService: PromotionPriceVariantService,
        private readonly jwtService: JwtService,
    ) {
        super(service);
    }

    @Query(() => [ProductVariantPrice])
    async GetPromotionsPrices(
        @Context() context
    ): Promise<ProductVariantPrice[]> {
        return new Promise(async (resolve, reject) => {
            const auth = context.req.headers.authorization;
            const token = auth.split(' ')[1];
            const admin: any = this.jwtService.decode(token)
            const all = this.promotionPriceVariantService.GetPromotionPriceForStore(admin.userId)
            resolve(all)
        })
    }
}
