import {CorsOptions} from '@nestjs/common/interfaces/external/cors-options.interface';
import {RequestHandler} from 'express';
import {PluginDefinition} from 'apollo-server-core';
import {DynamicModule, Type} from '@nestjs/common';
import {ClientOptions, Transport} from '@nestjs/microservices';
import {ConnectionOptions} from 'typeorm';
import {AssetsNamingStrategy} from './assets-naming-strategy/assets-naming-strategy';
import {AssetsPreviewStrategy} from './assets-preview-strategy/assets-preview-strategy';
import {AssetsStorageStrategy} from './assets-storage-strategy/assets-storage-strategy';
import {JobQueueStrategy} from './job-queue/job-queue-strategy';
import {GridIronLogger} from './logger/GridIronLogger';

export interface ApiOptions {
    hostname?: string
    port: number
    adminApiPath?: string
    shopApiPath?: string
    cors?: boolean | CorsOptions
    middleware?: Array<{handler: RequestHandler, route: string}>
    apolloServerPlugin?: PluginDefinition[];
}

export interface AuthOptions {
    authTokenHeaderKey?: string
}

export interface AssetOptions {
    assetNamingStrategy?: AssetsNamingStrategy;
    assetStorageStrategy?: AssetsStorageStrategy;
    assetPreviewStrategy?: AssetsPreviewStrategy;
    uploadMaxFileSize?: number;
}

export interface JobQueueOptions {
    jobQueueStrategy?: JobQueueStrategy;
    pollInterval?: number;
}

export interface WorkerOptions {
    runInMainProcess?: boolean;
    transport?: Transport;
    options?: ClientOptions['options'];
}

export interface GridIronConfig {
    apiOptions: ApiOptions;
    logger?: GridIronLogger
    plugins?: Array<DynamicModule | Type<any>>
    workerOptions?: WorkerOptions;
    authOptions?: AuthOptions
    dbConnectionOptions?: ConnectionOptions,
    assetOptions?: AssetOptions
    jobQueueOptions?: JobQueueOptions
    defaultTax?: number
    flatFeeAmount?: number
}

export interface RuntimeGridIronConfig extends Required<GridIronConfig>{
    apiOptions: Required<ApiOptions>
    assetOptions: Required<AssetOptions>
    authOptions: Required<AuthOptions>
    workerOptions: Required<WorkerOptions>
    jobQueueOptions: Required<JobQueueOptions>
}

type DeepPartialSimple<T> = {
    [P in keyof T]?:
    | null
    | (T[P] extends Array<infer U>
    ? Array<DeepPartialSimple<U>>
    : T[P] extends ReadonlyArray<infer X>
        ? ReadonlyArray<DeepPartialSimple<X>>
        : T[P] extends Type<any>
            ? T[P]
            : DeepPartialSimple<T[P]>);
};

export type PartialGridironConfig = DeepPartialSimple<GridIronConfig>;
