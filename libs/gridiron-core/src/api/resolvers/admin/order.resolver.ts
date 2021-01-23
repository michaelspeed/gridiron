import {Args, ID, Mutation, Resolver} from '@nestjs/graphql';
import {Order} from '../../../entity';
import {CRUDResolver, PagingStrategies} from '@nestjs-query/query-graphql';
import {InjectQueryService, QueryService} from '@nestjs-query/core';
import GraphQLJSON from "graphql-type-json";
import {OrderService} from "../../../service";
import {OrderLineDto} from "../../dto/admin/OrderLineDto";

@Resolver(() => Order)
export class OrderResolver extends CRUDResolver(Order, {
    pagingStrategy: PagingStrategies.OFFSET,
    enableAggregate: true,
    aggregate: {
        enabled: true
    },
    enableSubscriptions: true,
    create: {
        disabled: true
    },
    update: {
        disabled: true
    },
    delete: {
        disabled: true
    }
}){
    constructor(
        @InjectQueryService(Order) readonly service: QueryService<Order>,
        private orderService: OrderService
    ) {
        super(service);
    }

    @Mutation(() => Order)
    async createOrderAdmin(
        @Args('userId', {type: () => ID}) userId: string,
        @Args('address') address: string,
        @Args('orderLineDto', {type: () => [OrderLineDto]}) orderLineDto: OrderLineDto[],
    ): Promise<Order> {
        return this.orderService.createOrder(userId, orderLineDto, address)
    }
}
