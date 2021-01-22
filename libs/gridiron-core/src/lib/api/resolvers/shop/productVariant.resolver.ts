import {Args, Context, Field, ID, Int, Mutation, ObjectType, Query, Resolver} from "@nestjs/graphql";
import {Asset, Product, ProductVariant, ProductVariantPrice, Review} from "../../../entity";
import {ShopProductsService} from "../../../service";

@ObjectType()
class StockZip {
    @Field()
    stock: boolean

    @Field()
    zip: boolean
}

@Resolver(of => ProductVariant)
export class ShopProductVariantResolver {
    constructor(
        private readonly shopProductsService: ShopProductsService
    ) {}

    @Query(() => ProductVariant)
    async getSingleProductVariant(
        @Args('id', {type: () => ID}) id: string,
    ): Promise<ProductVariant> {
        return this.shopProductsService.getProductById(id)
    }

    @Query(() => Product)
    async singProductInfo(
        @Args('id', {type: () => ID}) id: string,
    ): Promise<Product> {
        return this.shopProductsService.singleProductById(id)
    }

    @Query(() => ProductVariant)
    async singProductPrice(
        @Args('id', {type: () => ID}) id: string,
    ): Promise<ProductVariant> {
        return this.shopProductsService.getPriceForVariants(id)
    }

    @Query(() => [ProductVariantPrice])
    async GetStocksAndZipAvailability(
        @Args('variantId', {type: () => ID}) variantId: string,
        @Args('zipf', {type: () => Int}) zipf: number,
    ): Promise<ProductVariantPrice[]> {
        return this.shopProductsService.GetStocksAndZipAvailability(variantId, zipf)
    }

    @Query(() => [ProductVariant])
    async getProductVariantByProduct(
        @Args('id', {type: () => ID}) id: string,
    ): Promise<ProductVariant[]> {
        return this.shopProductsService.getVariantsByProductId(id)
    }

    @Query(() => Asset)
    async getProductAsset(
        @Args('variantId', {type: () => ID, nullable: true}) variantId: string,
        @Args('prodId', {type: () => ID, nullable: true}) prodId: string,
    ): Promise<Asset> {
        return this.shopProductsService.getProdAsset({variantId, prodId})
    }

    @Mutation(() => ProductVariant)
    async ShiftProductVariant(
        @Args('name') name: string,
        @Args('prodId') prodId: string,
    ): Promise<ProductVariant> {
        return this.shopProductsService.ShiftProductVariant(name, prodId)
    }

    @Mutation(() => Review)
    async creteReview(
        @Args('text') text: string,
        @Args('varId') varId: string,
        @Args('stars') stars: number,
        @Context() context
    ): Promise<Review> {
        const auth = context.req.headers.authorization;
        const token = auth.split(' ')[1];
        return this.shopProductsService.CreateReview(varId, text, stars, token)
    }

    @Query(() => ProductVariantPrice)
    async GetSingleProductPrice(
        @Args('id', {type: () => ID}) id: string,
    ): Promise<ProductVariantPrice> {
        return this.shopProductsService.getSingleProductVariantPrices(id)
    }
}
