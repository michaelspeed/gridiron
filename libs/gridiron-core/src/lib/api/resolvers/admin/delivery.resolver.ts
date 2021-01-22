import {Args, Context, ID, Mutation, Query, Resolver} from "@nestjs/graphql";
import {Delivery, DeliveryPool, DeliverySignIn} from "../../../entity";
import {DeliveryService} from "../../../service";
import {JwtService} from "@nestjs/jwt";
import {CRUDResolver, PagingStrategies} from "@nestjs-query/query-graphql";
import {InjectQueryService, QueryService} from "@nestjs-query/core";
import {DeliveryStrandedCount} from "@gridiron/core/api/dto/admin/pool-types";

@Resolver(() => Delivery)
export class DeliveryResolver extends CRUDResolver(Delivery, {
    create: {
        disabled: true
    },
    update: {
        disabled: true
    },
    delete: {
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
        @InjectQueryService(Delivery) readonly service: QueryService<Delivery>,
        private readonly deliveryService: DeliveryService,
        private readonly jwtService: JwtService,
    ) {
        super(service)
    }

    @Mutation(() => Delivery)
    async SetNewDeliveryGuy(
        @Args('userId', {type: () => ID}) userId: string,
        @Context() context
    ): Promise<Delivery> {
        const auth = context.req.headers.authorization;
        const token = auth.split(' ')[1];
        const admin: any = this.jwtService.decode(token)
        return this.deliveryService.SetNewDeliveryGuy(userId, admin.userId)
    }

    @Mutation(() => DeliverySignIn)
    async SetDeliverySignIn(
        @Args('type') type: boolean,
        @Context() context
    ): Promise<DeliverySignIn> {
        const auth = context.req.headers.authorization;
        const token = auth.split(' ')[1];
        const admin: any = this.jwtService.decode(token)
        return this.deliveryService.SetDeliveryActive(admin.userId, type)
    }

    @Query(() => [DeliveryPool])
    async GetPoolStrength(): Promise<DeliveryPool[]> {
        return this.deliveryService.GetPoolStrength()
    }

    @Query(() => DeliveryStrandedCount)
    async GetDeliveryStrandedCount(): Promise<DeliveryStrandedCount> {
        return this.deliveryService.GetStrandedDelivery()
    }
}
