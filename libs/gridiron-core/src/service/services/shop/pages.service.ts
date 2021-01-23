import {Injectable} from "@nestjs/common";
import {InjectConnection} from "@nestjs/typeorm";
import {Connection} from "typeorm";
import {Page} from "../../../entity";
import {PageCategory} from "../../../enums";

@Injectable()
export class ShopPagesService {
    constructor(
        @InjectConnection() private connection: Connection
    ) {}

    async getHomePageData(): Promise<Page> {
        return this.connection.getRepository(Page).findOne({where: {pageCategory: PageCategory.HOME}})
    }

    async getPageData(id: string): Promise<Page> {
        return this.connection.getRepository(Page).findOne({where: {id: id}})
    }
}
