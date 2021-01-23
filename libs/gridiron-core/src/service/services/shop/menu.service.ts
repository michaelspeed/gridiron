import { Menu } from '@gridiron/entities';
import {Injectable} from '@nestjs/common';
import {InjectConnection} from '@nestjs/typeorm';
import {Connection} from 'typeorm';

@Injectable()
export class MenuService {

    constructor(
       @InjectConnection() private connection: Connection
    ) {}

    async GetMenuTree(): Promise<{menu: string}> {
        return new Promise(async (resolve) => {
            const men = await this.connection.getTreeRepository(Menu).findTrees()
            resolve({
                menu: JSON.stringify(men)
            })
        })
    }
}
