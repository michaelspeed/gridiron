import {Args, Mutation, Query, Resolver} from "@nestjs/graphql";
import {PaymentMethod} from "../../../entity";
import {PaymentMethodService} from "../../../service";

@Resolver(() => PaymentMethod)
export class PaymentMethodResolver {
    constructor(
        private readonly paymentMethodService: PaymentMethodService
    ) {}

    @Query(() => [PaymentMethod])
    async GetAllPaymentMethods(): Promise<PaymentMethod[]> {
        return this.paymentMethodService.GetAllPaymentMethods()
    }

    @Query(() => PaymentMethod)
    async GetDefaultPaymentMethods(): Promise<PaymentMethod> {
        return this.paymentMethodService.GetDefaultPaymentMethod()
    }

    @Mutation(() => PaymentMethod)
    async CreatePaymentMethod(
        @Args('api') api: string,
        @Args('secret') secret: string,
    ): Promise<PaymentMethod> {
        return this.paymentMethodService.CreatePaymentMethod(api, secret)
    }

    @Mutation(() => PaymentMethod)
    async UpdatePaymentMethod(
        @Args('modeId') modeId: string,
        @Args('enabled') enabled: boolean,
    ): Promise<PaymentMethod> {
        return this.paymentMethodService.UpdatePaymentMethod(modeId, enabled)
    }
}
