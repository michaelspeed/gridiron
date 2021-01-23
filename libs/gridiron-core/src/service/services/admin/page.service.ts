import { Page, PageCategory } from "@gridiron/entities";
import {Injectable} from "@nestjs/common";
import {InjectConnection} from "@nestjs/typeorm";
import {Connection} from "typeorm";

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
