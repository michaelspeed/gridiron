import {BaseEntity, Connection, ConnectionOptions} from 'typeorm';
import {getColumnMetadata} from './get-column-metadata';
import {DateUtils} from 'typeorm/util/DateUtils';
import { StringOperators, BooleanOperators, NumberOperators, DateOperators, NullOptionals, FilterParameter, UserInputError, assertNever } from '@gridiron/gridiron-common';
import { Type } from '@nestjs/common';

export interface WhereCondition {
    clause: string;
    parameters: { [param: string]: string | number };
}

type AllOperators = StringOperators & BooleanOperators & NumberOperators & DateOperators;
type Operator = { [K in keyof AllOperators]-?: K }[keyof AllOperators];


export function parseFilterParams<T extends BaseEntity>(
    connection: Connection,
    entity: Type<T>,
    filterParams?: NullOptionals<FilterParameter<T>> | null,
): WhereCondition[] {
    if (!filterParams) {
        return [];
    }
    const { columns, translationColumns, alias } = getColumnMetadata(connection, entity);
    const output: WhereCondition[] = [];
    const dbType = connection.options.type;
    let argIndex = 1;
    for (const [key, operation] of Object.entries(filterParams)) {
        if (operation) {
            // eslint-disable-next-line @typescript-eslint/ban-types
            for (const [operator, operand] of Object.entries(operation as object)) {
                let fieldName: string;
                if (columns.find(c => c.propertyName === key)) {
                    fieldName = `${alias}.${key}`;
                } else if (translationColumns.find(c => c.propertyName === key)) {
                    fieldName = `${alias}_translations.${key}`;
                } else {
                    throw new UserInputError('error.invalid-filter-field');
                }
                const condition = buildWhereCondition(
                    fieldName,
                    operator as Operator,
                    operand,
                    argIndex,
                    dbType,
                );
                output.push(condition);
                argIndex++;
            }
        }
    }

    return output;
}

function buildWhereCondition(
    fieldName: string,
    operator: Operator,
    operand: any,
    argIndex: number,
    dbType: ConnectionOptions['type'],
): WhereCondition {
    switch (operator) {
        case 'eq':
            return {
                clause: `${fieldName} = :arg${argIndex}`,
                parameters: { [`arg${argIndex}`]: convertDate(operand) },
            };
        case 'contains':
            // eslint-disable-next-line no-case-declarations
            const LIKE = dbType === 'postgres' ? 'ILIKE' : 'LIKE';
            return {
                clause: `${fieldName} ${LIKE} :arg${argIndex}`,
                parameters: { [`arg${argIndex}`]: `%${operand.trim()}%` },
            };
        case 'lt':
        case 'before':
            return {
                clause: `${fieldName} < :arg${argIndex}`,
                parameters: { [`arg${argIndex}`]: convertDate(operand) },
            };
        case 'gt':
        case 'after':
            return {
                clause: `${fieldName} > :arg${argIndex}`,
                parameters: { [`arg${argIndex}`]: convertDate(operand) },
            };
        case 'lte':
            return {
                clause: `${fieldName} <= :arg${argIndex}`,
                parameters: { [`arg${argIndex}`]: operand },
            };
        case 'gte':
            return {
                clause: `${fieldName} >= :arg${argIndex}`,
                parameters: { [`arg${argIndex}`]: operand },
            };
        case 'between':
            return {
                clause: `${fieldName} BETWEEN :arg${argIndex}_a AND :arg${argIndex}_b`,
                parameters: {
                    [`arg${argIndex}_a`]: convertDate(operand.start),
                    [`arg${argIndex}_b`]: convertDate(operand.end),
                },
            };
        default:
            assertNever(operator);
    }
    return {
        clause: '1',
        parameters: {},
    };
}

/**
 * Converts a JS Date object to a string format recognized by all DB engines.
 * See https://github.com/vendure-ecommerce/vendure/issues/251
 */
function convertDate(input: Date | string | number): string | number {
    if (input instanceof Date) {
        return DateUtils.mixedDateToUtcDatetimeString(input);
    }
    return input;
}
