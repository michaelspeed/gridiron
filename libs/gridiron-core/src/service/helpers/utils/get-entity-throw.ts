import {BaseEntity, Connection, FindOneOptions} from 'typeorm';
import {EntityNotFoundError, ID, SoftDeletable, Type} from '@gridiron/gridiron-common';
import { GridIronEntity } from '@gridiron/entities';

export async function GetEntityOrThrow<T extends GridIronEntity | BaseEntity>(
    connection: Connection,
    entityType: Type<T>,
    id: ID,
    maybeFindOptions?: FindOneOptions<T>
) {
    let entity: T | undefined
    // eslint-disable-next-line prefer-const
    entity = await connection.getRepository(entityType).findOne(id, maybeFindOptions)
    // eslint-disable-next-line no-prototype-builtins
    if (!entity || (entity.hasOwnProperty('deletedAt') && (entity as T & SoftDeletable).deletedAt !== null)) {
        throw new EntityNotFoundError(entityType.name as any, id)
    }
    return entity
}
