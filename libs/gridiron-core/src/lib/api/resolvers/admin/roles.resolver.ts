import {Args, ID, Mutation, Resolver} from '@nestjs/graphql';
import {CRUDResolver, PagingStrategies} from '@nestjs-query/query-graphql';
import {InjectQueryService, QueryService} from '@nestjs-query/core';
import {Role} from '../../../entity';
import {RolesService} from '../../../service';
import {Permission} from '../../../enums';

@Resolver(of => Role)
export class RolesResolver extends CRUDResolver(Role, {
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
        @InjectQueryService(Role) readonly service: QueryService<Role>,
        private readonly rolesService: RolesService
    ) {
        super(service);
    }

    @Mutation(() => Role)
    async createRole(
        @Args('code') code: string,
        @Args('description') description: string,
        @Args({name:'roles', type: () => [Permission]}) roles: Permission[],
    ): Promise<Role> {
        return this.rolesService.createRole(code, roles, description)
    }

    @Mutation(() => Role)
    async updateRole(
        @Args({name: 'id', type: () => ID}) id: string,
        @Args('description') description: string,
        @Args({name:'roles', type: () => [Permission]}) roles: Permission[],
    ): Promise<Role> {
        return this.rolesService.updateRole(roles, description, id)
    }
}
