import {Injectable} from '@nestjs/common';
import {InjectConnection} from '@nestjs/typeorm';
import {Connection} from 'typeorm';
import {Menu} from '../../../entity';
import {MenuBuilderTypes} from '../../../enums/MenuBuilderTypes';

@Injectable()
export class AdminMenuService {
    constructor(
        @InjectConnection() private connection: Connection,
    ) {}

    async getMenuTree(): Promise<{menu: string}> {
        return new Promise(async (resolve, reject) => {
          const men = await this.connection.getTreeRepository(Menu).findTrees()
          resolve({
              menu: JSON.stringify(men)
          })
        })
    }

    async CreateMenuChildNode(nodeId: string, title: string, targetId: string, target: string): Promise<Menu> {
        return new Promise(async (resolve, reject) => {
            const menuNode = await this.connection.getRepository(Menu).findOne({where:{id: nodeId}})
            const menu = new Menu()
            menu.parent = menuNode
            menu.target = target as MenuBuilderTypes
            menu.title = title
            menu.targetId = targetId
            this.connection.getRepository(Menu).save(menu)
                .then(value => resolve(value))
                .catch(error => reject(error))
        })
    }
}
