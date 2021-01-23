import {Injectable} from '@nestjs/common';
import {Collection, Menu} from '../../../entity';
import {InjectConnection} from '@nestjs/typeorm';
import {Connection} from 'typeorm';

@Injectable()
export class MenuService {

    constructor(
       @InjectConnection() private connection: Connection
    ) {}

    async GetMenuTree(): Promise<{menu: string}> {
        return new Promise(async (resolve, reject) => {
            const men = await this.connection.getTreeRepository(Menu).findTrees()
            resolve({
                menu: JSON.stringify(men)
            })
        })
    }
}
