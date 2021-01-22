import {Args, ID, Int, Mutation, Query, Resolver} from "@nestjs/graphql";
import {ShopCartService} from "../../../service";
import {Cart, CartItem} from "../../../entity";

@Resolver(() => Cart)
export class SearchCartResolver {
    constructor(
        private readonly shopCartServices: ShopCartService
    ) {}

    @Query(() => Cart)
    async GetCart(
        @Args('id', {type: () => ID}) id: string,
    ): Promise<Cart> {
        return this.shopCartServices.getCart(id)
    }

    @Mutation(() => CartItem)
    async addToCart(
        @Args('userId', {type: () => ID}) userId: string,
        @Args('variant', {type: () => ID}) variant: string,
        @Args('store', {type: () => ID}) store: string,
        @Args('price', {type: () => ID}) price: string,
        @Args('quantity', {type: () => Int}) quantity: number,
    ): Promise<CartItem> {
        return this.shopCartServices.addToCart(userId, variant, store, price, quantity)
    }

    @Mutation(() => CartItem)
    async removeCartItem(
        @Args('cartId', {type: () => ID}) cartId: string,
    ): Promise<CartItem> {
        return this.shopCartServices.removeCartItem(cartId)
    }
}
