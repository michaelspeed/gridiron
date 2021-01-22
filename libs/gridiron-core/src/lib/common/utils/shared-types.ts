import {Field, ObjectType} from '@nestjs/graphql';

export type DeepPartial<T> = {
    [P in keyof T]?:
    | null
    | (T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
        ? ReadonlyArray<DeepPartial<U>>
        : DeepPartial<T[P]>);
};

export type DeepRequired<T, U extends object | undefined = undefined> = T extends object
    ? {
        [P in keyof T]-?: NonNullable<T[P]> extends NonNullable<U | Function | Type<any>>
            ? NonNullable<T[P]>
            : DeepRequired<NonNullable<T[P]>, U>;
    }
    : T;

export interface Type<T> extends Function {
    // tslint:disable-next-line:callable-types
    new (...args: any[]): T;
}

export type Json = null | boolean | number | string | Json[] | { [prop: string]: Json };

export type ID = string | number;

export type JsonCompatible<T> = {
    [P in keyof T]: T[P] extends Json
        ? T[P]
        : Pick<T, P> extends Required<Pick<T, P>>
            ? never
            : JsonCompatible<T[P]>;
};

export enum AssetType {
    IMAGE = 'IMAGE',
    VIDEO = 'VIDEO',
    BINARY = 'BINARY',
}

export declare type PaginatedList<T> = {
    items: T[];
    totalItems: number;
};
