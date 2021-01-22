import {Args, ID, Mutation, Query, Resolver} from '@nestjs/graphql';
import {Menu} from '../../../entity';
import {CRUDResolver, PagingStrategies} from '@nestjs-query/query-graphql';
import {InjectQueryService, QueryService} from '@nestjs-query/core';
import {MenuResponseTypes} from '../../dto/admin/menu-response.types';
import {AdminMenuService} from '../../../service/services/admin/menu.service';

@Resolver(() => Menu)
export class AdminMenuResolver extends CRUDResolver(Menu, {
    pagingStrategy: PagingStrategies.OFFSET,
    enableAggregate: true,
    aggregate: {
        enabled: true
    },
    enableSubscriptions: true
}){
    constructor(
        @InjectQueryService(Menu) readonly service: QueryService<Menu>,
            private adminMenuService: AdminMenuService
    ) {
        super(service);
    }

    @Query(() => MenuResponseTypes)
    async GetMenuTree(): Promise<MenuResponseTypes> {
        return this.adminMenuService.getMenuTree()
    }

    @Mutation(() => Menu)
    async CreateMenuChildNode(
        @Args('nodeId', {type: () => ID}) nodeId: string,
        @Args('title', {type: () => String}) title: string,
        @Args('targetId', {type: () => String}) targetId: string,
        @Args('target', {type: () => String}) target: string,
    ): Promise<Menu> {
        return this.adminMenuService.CreateMenuChildNode(nodeId, title, targetId, target)
    }
}
