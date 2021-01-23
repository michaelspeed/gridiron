import {Transport} from '@nestjs/microservices';
import {RuntimeGridIronConfig} from './GridIronConfig';
import {NoAssetsPreviewStrategy} from './assets-preview-strategy/no-assets-preview-strategy';
import {InMemoryJobQueueStrategy} from '../job-queue/in-memory-job-queue-strategy';
import {DefaultAssetsNamingStrategy} from './assets-naming-strategy/default-assets-naming-strategy';
import {DefaultLogger} from './logger/DefaultLogger';
import {NoAssetsStorageStrategy} from './assets-storage-strategy/no-assets-storage-strategy';

export const defaultConfig: RuntimeGridIronConfig = {
    logger: new DefaultLogger(),
    apiOptions: {
        hostname: '',
        port: 5588,
        adminApiPath: 'admin-api',
        shopApiPath: 'shop-api',
        cors: true,
        middleware: [],
        apolloServerPlugin: []
    },
    plugins: [

    ],
    workerOptions: {
        runInMainProcess: false,
        transport: Transport.TCP,
        options: {
            port: 3020
        }
    },
    authOptions: {
        authTokenHeaderKey: 'gridiron-key'
    },
    assetOptions: {
        assetNamingStrategy: new DefaultAssetsNamingStrategy(),
        assetStorageStrategy: new NoAssetsStorageStrategy(),
        assetPreviewStrategy: new NoAssetsPreviewStrategy(),
        uploadMaxFileSize: 20971520,
    },
    dbConnectionOptions: {
        database: 'gridiron',
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'mike0001',
        synchronize: true,
        connectTimeout: 1000000,
    },
    jobQueueOptions: {
        jobQueueStrategy: new InMemoryJobQueueStrategy(),
        pollInterval: 200,
    },
    defaultTax: 10,
    flatFeeAmount: 2
}
