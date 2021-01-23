import {GridIronEntity} from '../../../entity/base/base.entity';
import {BaseEntity, Connection, OrderByCondition} from 'typeorm';
import {NullOptionals, SortParameter, Type, UserInputError} from '../../../common';
import {getColumnMetadata} from './get-column-metadata';
import {ColumnMetadata} from 'typeorm/metadata/ColumnMetadata';
import {unique} from '../../../common/utils/unique';

export function parseSortParams<T extends GridIronEntity | BaseEntity>(
    connection: Connection,
    entity: Type<T>,
    sortParams?: NullOptionals<SortParameter<T>> | null,
): OrderByCondition {
    if (!sortParams || Object.keys(sortParams).length === 0) {
        return {};
    }
    const { columns, translationColumns, alias } = getColumnMetadata(connection, entity);
    const output: OrderByCondition = {};
    for (const [key, order] of Object.entries(sortParams)) {
        if (columns.find(c => c.propertyName === key)) {
            output[`${alias}.${key}`] = order as any;
        } else if (translationColumns.find(c => c.propertyName === key)) {
            output[`${alias}_translations.${key}`] = order as any;
        } else {
            throw new UserInputError('error.invalid-sort-field', {
                fieldName: key,
                validFields: getValidSortFields([...columns, ...translationColumns]),
            });
        }
    }
    return output;
}

function getValidSortFields(columns: ColumnMetadata[]): string {
    return unique(columns.map(c => c.propertyName)).join(', ');
}
