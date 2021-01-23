import {Injectable} from "@nestjs/common";
import {InjectConnection} from "@nestjs/typeorm";
import {Connection} from "typeorm";
import {Page} from "../../../entity";
import {PageCategory} from "../../../enums";

@Injectable()
export class PageService {
    constructor(
        @InjectConnection() private connection: Connection
    ) {
    }

    async getHomeMenu(): Promise<Page> {
        return new Promise(async (resolve, reject) => {
            const home = await this.connection.getRepository(Page).findOne({where:{pageCategory: PageCategory.HOME}})
            if (home) {
                resolve(home)
            } else {
                reject('Home Page Not Found')
            }
        })
    }
}
