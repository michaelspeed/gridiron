import {GridIronEntity} from '../../entity/base/base.entity';
import {BaseEntity} from 'typeorm';

export type LocaleString = string & { _opaqueType: 'LocaleString' };

export type FilterParameter<T extends GridIronEntity | BaseEntity> = {
    [K in PrimitiveFields<T>]?: T[K] extends string | LocaleString ? StringOperators
        : T[K] extends number ? NumberOperators
            : T[K] extends boolean ? BooleanOperators
                : T[K] extends Date ? DateOperators : StringOperators;
};

export interface StringOperators {
    eq?: string;
    contains?: string;
}

export interface BooleanOperators {
    eq?: boolean;
}

export interface NumberRange {
    start: number;
    end: number;
}

export interface NumberOperators {
    eq?: number;
    lt?: number;
    lte?: number;
    gt?: number;
    gte?: number;
    between?: NumberRange;
}

export interface DateRange {
    start: Date;
    end: Date;
}

export interface DateOperators {
    eq?: Date;
    before?: Date;
    after?: Date;
    between?: DateRange;
}

export interface SoftDeletable {
    deletedAt: Date | null;
}

export type SortOrder = 'ASC' | 'DESC';

export type NullOptionals<T> = {
    [K in keyof T]: undefined extends T[K] ? NullOptionals<T[K]> | null : NullOptionals<T[K]>
};

export type PrimitiveFields<T extends GridIronEntity | BaseEntity> = {
    [K in keyof T]: T[K] extends LocaleString | number | string | boolean | Date ? K : never
}[keyof T];

export type SortParameter<T extends GridIronEntity> = {
    [K in PrimitiveFields<T>]?: SortOrder
};

export interface ListQueryOptions<T extends GridIronEntity | BaseEntity> {
    take?: number | null;
    skip?: number | null;
    sort?: NullOptionals<SortParameter<T>> | null;
    filter?: NullOptionals<FilterParameter<T>> | null;
}

export declare type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
