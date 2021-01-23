import { Collection } from '@gridiron/entities';
import {Query, Resolver} from '@nestjs/graphql';
import {MenuService} from '../../../service';
import {MenuResponseTypes} from "../../dto/admin/menu-response.types";

@Resolver(() => Collection)
export class MenuResolver {
    constructor(
        private readonly menuService: MenuService
    ) {
    }

    @Query(() => MenuResponseTypes)
    async GetMenu(): Promise<MenuResponseTypes> {
        return this.menuService.GetMenuTree()
    }
}
