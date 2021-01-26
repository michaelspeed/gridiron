import {GridIronConfig, DefaultLogger, DefaultAssetsNamingStrategy, InMemoryJobQueueStrategy} from '@gridiron/gridiron-core'
import {configureS3AssetStorage, AssetsServerPlugin} from '@gridiron/asset-server-plugin'
import {Transport} from '@nestjs/microservices'
import * as path from 'path';

export const DEF_CONFIG: GridIronConfig = {
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
        AssetsServerPlugin.init({
            route: 'assets',
            assetUploadDir: path.join(__dirname, 'assets'),
            port: 5002,
            namingStrategy: new DefaultAssetsNamingStrategy(),
            storageStrategyFactory: configureS3AssetStorage({
                bucket: 'assmamart',
                credentials: {
                    accessKeyId: 'AKIASNOC7JBKTHJSQK5J',
                    secretAccessKey: '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'
                }
            })
        }),
        /*EmailPlugin.init({
            devMode: true,
            handlers: defaultEmailHandlers,
            templatePath: path.join(__dirname, 'templates'),
            outputPath: path.join(__dirname, 'test-emails'),
            mailboxPort: 5003,
            globalTemplateVars: {
                verifyEmailAddressUrl: 'http://localhost:4201/verify',
                passwordResetUrl: 'http://localhost:4201/reset-password',
            },
        })*/
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
    dbConnectionOptions: {
        database: 'anibo-shop',
        type: 'mysql',
        host: 'ls-cac559240bd8e22d83894da3b6ee0768e4d43bc1.cxkzwswlsfxz.ap-south-1.rds.amazonaws.com',
        port: 3306,
        username: 'root',
        password: '%gqg28yBNf73RPjTHX$yij3G$J1vcn?a',
        connectTimeout: 1000000,
        synchronize: false,
        /*logger: "advanced-console",
        logging: "all"*/
    },
    jobQueueOptions: {
        jobQueueStrategy: new InMemoryJobQueueStrategy(),
        pollInterval: 200,
    },
    defaultTax: 10,
    flatFeeAmount: 2
}