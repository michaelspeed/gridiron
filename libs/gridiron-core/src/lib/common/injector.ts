import {ContextId, ModuleRef} from '@nestjs/core';
import {Type} from '@nestjs/common';
import {Connection} from 'typeorm';
import {getConnectionToken} from '@nestjs/typeorm';

export class Injector {
    constructor(
        private moduleRef: ModuleRef
    ) {}

    get<T, R = T>(typeOrToken: Type<T> | string | symbol): R {
        return this.moduleRef.get(typeOrToken, {strict: false})
    }

    getConnection(): Connection {
        return this.moduleRef.get(getConnectionToken() as any, {strict: false})
    }

    resolve<T, R = T>(typeOrToken: Type<T> | string | symbol, contextId?: ContextId): Promise<R> {
        return this.moduleRef.resolve(typeOrToken, contextId, {strict: false})
    }
}
