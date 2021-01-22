import {ApolloError} from 'apollo-client';
import {LogLevel} from '../../config';
import {coreEntityMap} from '../../entity/coreEntityMap';
import {ID} from '../../common';

export abstract class LangError extends ApolloError {
    protected constructor(
        public message: string,
        public variables: { [key: string]: string | number } = {},
        public code?: string,
        public logLevel: LogLevel = LogLevel.Warn,
    ) {
        // @ts-ignore
        super(message, code);
    }
}

export class InternalServerError extends LangError {
    constructor(message: string, variables: {[key: string]: string | number} = {}) {
        super(message, variables, 'INTERNAL SERVER ERROR', LogLevel.Error);
    }
}

export class UserInputError extends LangError {
    constructor(message: string, variables: { [key: string]: string | number } = {}) {
        super(message, variables, 'USER_INPUT_ERROR', LogLevel.Warn);
    }
}

export class EntityNotFoundError extends LangError {
    constructor(entityName: keyof typeof coreEntityMap, id: ID) {
        super('error.entity-with-id-not-found', { entityName, id }, 'ENTITY_NOT_FOUND', LogLevel.Warn);
    }
}
