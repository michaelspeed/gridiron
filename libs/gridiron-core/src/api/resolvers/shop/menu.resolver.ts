import {Query, Resolver} from '@nestjs/graphql';
import {Collection} from '../../../entity';
import {MenuService} from '../../../service';
import {MenuResponseTypes} from "../../dto/admin/menu-response.types";

@Resolver(of => Collection)
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
