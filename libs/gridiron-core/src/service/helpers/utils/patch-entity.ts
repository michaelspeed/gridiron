import {GridIronEntity} from '../../../entity/base/base.entity';
import {BaseEntity} from 'typeorm';

export type InputPatch<T> = { [K in keyof T]?: T[K] | null };

export function patchEntity<T extends GridIronEntity | BaseEntity, I extends InputPatch<T>>(entity: T, input: I): T {
    for (const key of Object.keys(entity)) {
        const value = input[key as keyof T];
        entity[key as keyof T] = value as any;
    }
    return entity
}
