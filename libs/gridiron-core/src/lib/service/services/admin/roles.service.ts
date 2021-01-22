import {Injectable} from '@nestjs/common';
import {InjectConnection} from '@nestjs/typeorm';
import {Connection} from 'typeorm';
import {Role} from '../../../entity';
import {Permission} from '../../../enums';

@Injectable()
export class RolesService {
    constructor(
       @InjectConnection() private connection: Connection
    ) {}

    createRole(code: string, roles: Permission[], description: string): Promise<Role> {
        return new Promise<Role>((resolve, reject) => {
            const role = new Role()
            role.code = code
            role.permissions = roles
            role.description = description
            this.connection.getRepository(Role).save(role).then(value => resolve(value)).catch(error => reject(error))
        })
    }

    updateRole(roles: Permission[], description: string, id: string): Promise<Role> {
        return new Promise<Role>(async (resolve, reject) => {
            const role = await this.connection.getRepository(Role).findOne({where: {id}})
            role.description = description
            role.permissions = roles
            this.connection.getRepository(Role).save(role).then(value => resolve(value)).catch(error => reject(error))
        })
    }
}
