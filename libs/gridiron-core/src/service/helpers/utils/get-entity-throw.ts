import {GridIronEntity} from '../../../entity/base/base.entity';
import {BaseEntity, Connection, FindOneOptions} from 'typeorm';
import {EntityNotFoundError, ID, SoftDeletable, Type} from '../../../common';

export async function GetEntityOrThrow<T extends GridIronEntity | BaseEntity>(
    connection: Connection,
    entityType: Type<T>,
    id: ID,
    maybeFindOptions?: FindOneOptions<T>
) {
    let entity: T | undefined
    entity = await connection.getRepository(entityType).findOne(id, maybeFindOptions)
    if (!entity || (entity.hasOwnProperty('deletedAt') && (entity as T & SoftDeletable).deletedAt !== null)) {
        throw new EntityNotFoundError(entityType.name as any, id)
    }
    return entity
}
