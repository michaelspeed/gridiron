import {Args, Context, ID, Mutation, Query, Resolver} from "@nestjs/graphql";
import {Order, PaymentMethod} from "../../../entity";
import {ShopOrderService} from "../../../service/services/shop/order.service";
import {CartItemDto} from "../../dto/shop/CartItemDto";
import {ShopPaymentService} from "../../../service/services/shop/payment.service";

@Resolver(() => Order)
export class ShopOrderResolver {
    constructor(
        private readonly orderService: ShopOrderService,
        private readonly paymentService: ShopPaymentService
    ) {}

    @Mutation(() => Order)
    async createShopOrder(
        @Args('address') address: string,
        @Args('orderLineDto', {type: () => [CartItemDto]}) orderLineDto: CartItemDto[],
        @Args('transaction', {nullable: true}) transaction: string,
        @Context() context
    ): Promise<Order> {
        const auth = context.req.headers.authorization;
        const token = auth.split(' ')[1];
        const decoded = await this.orderService.DecryptToken(token)
        return this.orderService.createShopOrder(orderLineDto, decoded.userId, address, transaction)
    }

    @Query(() => PaymentMethod)
    async getPaymentCodes(): Promise<PaymentMethod> {
        return this.paymentService.getPaymentCodes()
    }

    @Query(() => [Order])
    async getMyOrders(
        @Context() context
    ): Promise<Order[]> {
        const auth = context.req.headers.authorization;
        const token = auth.split(' ')[1];
        return this.orderService.getMyOrders(token)
    }

    @Query(() => Order)
    async getSingleOrder(
        @Args('id', {type: () => ID}) id: string,
    ) {
        return this.orderService.getSingleOrder(id)
    }
}
