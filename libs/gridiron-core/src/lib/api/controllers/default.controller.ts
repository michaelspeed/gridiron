import {Controller, Get, Param} from "@nestjs/common";
import {ShopPagesService} from "@gridiron/core";

@Controller()
export class DefaultController {

    constructor(
        private readonly shopPagesService: ShopPagesService
    ) {}

    @Get()
    public getHello() {
        return 'GetHello'
    }

    @Get('/homepage')
    async getHomePage() {
        return this.shopPagesService.getHomePageData();
    }

    @Get('/page/:id')
    async getPageData(@Param() params) {
        return this.shopPagesService.getPageData(params.id);
    }
}
