import {INestApplication, INestMicroservice} from '@nestjs/common';
import {TcpClientOptions, Transport} from '@nestjs/microservices';
import {NestFactory} from '@nestjs/core';
import {DefaultLogger, GridIronConfig, Logger, RuntimeGridIronConfig} from './config';
import {getConfig, setConfig} from './config/config-helpers';
import {InternalServerError, ReadOnlyRequired, Type} from './common';
import {NestjsQueryTypeOrmModule} from '@nestjs-query/query-typeorm';
import {getConfigurationFunction, getEntitiesFromPlugin} from './plugin/plugin-metadata';
import {coreEntityMap} from './entity/coreEntityMap';

export const GridironVersion = '0.0.1'

export async function BootstrapServer(userConfig: Partial<GridIronConfig>): Promise<INestApplication> {
    const config = await preBootStrapServer(userConfig)
    Logger.useLogger(config.logger)
    Logger.info(`Bootstrapping Gridiron Server (pid: ${process.pid})...`)

    const appModule = await import('./core.module')
    const {hostname, port, cors} = config.apiOptions
    // DefaultLogger.hideNestBoostrapLogs()
    const app = await NestFactory.create(appModule.CoreModule, {
        cors,
        logger: new Logger()
    })
    // DefaultLogger.restoreOriginalLogLevel()
    app.useLogger(new Logger())
    app.enableCors({origin: '*'})
    await app.listen(port, hostname || '')
    app.enableShutdownHooks()
    if (config.workerOptions.runInMainProcess) {
        try {
            const worker = await bootstrapWorkerInternal(config);
            Logger.warn(`Worker is running in main process. This is not recommended for production.`);
            Logger.warn(`[GridironConfig.workerOptions.runInMainProcess = true]`);
            closeWorkerOnAppClose(app, worker);
        } catch (e) {
            Logger.error(`Could not start the worker process: ${e.message}`, 'GridironConfig Worker');
        }
    }
    logWelcomeMessage(config)
    return app;
}

export async function BootstrapWorker(userConfig: Partial<GridIronConfig>): Promise<INestMicroservice> {
    if (userConfig.workerOptions && userConfig.workerOptions.runInMainProcess === true) {
        Logger.useLogger(userConfig.logger || new DefaultLogger())
        const errorMessage = `Cannot bootstrap worker when "runInMainProcess" is set to true`;
        Logger.error(errorMessage, 'Gridiron Worker');
        throw new Error(errorMessage)
    } else {
        try {
            const gridConfig = await preBootStrapServer(userConfig)
            return await bootstrapWorkerInternal(gridConfig)
        } catch (e) {
            Logger.error(`Could not start the worker process: ${e.message}`, 'Gridiron Worker');
            throw e;
        }
    }
}

export async function bootstrapWorkerInternal(
    gridIronConfig: ReadOnlyRequired<GridIronConfig>
): Promise<INestMicroservice> {
    if (!gridIronConfig.workerOptions.runInMainProcess && (gridIronConfig.logger as any).setDefaultContext) {
        (gridIronConfig.logger as any).setDefaultContext('Gridiron Worker')
    }
    Logger.useLogger(gridIronConfig.logger)
    Logger.info(`Bootstrapping Gridiron Worker (pid: ${process.pid})...`)

    const workerModule = await import('./worker/worker.module')
    DefaultLogger.hideNestBoostrapLogs()
    const workerApp = await NestFactory.createMicroservice(workerModule.WorkerModule, {
        transport: gridIronConfig.workerOptions.transport,
        logger: new Logger(),
        options: gridIronConfig.workerOptions.options,
    })
    DefaultLogger.restoreOriginalLogLevel()
    workerApp.useLogger(new Logger())
    workerApp.enableShutdownHooks()

    await new Promise((resolve, reject) => {
        const tcpServer = (workerApp as any).server.server
        if (tcpServer) {
            tcpServer.on('error', (e: any) => {
                reject(e)
            })
        }
        workerApp.listenAsync().then(resolve)
    })
    workerWelcomeMessage(gridIronConfig)
    return workerApp;
}

export async function preBootStrapServer(userConfig: Partial<GridIronConfig>): Promise<Readonly<RuntimeGridIronConfig>> {
    if (userConfig) {
        await setConfig(userConfig)
    }
    const entities = await getAllEntities(userConfig)
    await setConfig({
        dbConnectionOptions: {
            entities
        }
    })
    let config = getConfig()
    config = await runPluginConfiguration(config)
    setExposedHeaders(config)
    return config
}

export async function runPluginConfiguration(config: RuntimeGridIronConfig): Promise<RuntimeGridIronConfig> {
    for (const plugin of config.plugins) {
        const configFn = getConfigurationFunction(plugin)
        if (typeof configFn === 'function') {
            config = await configFn(config)
        }
    }
    return config;
}

export async function getAllEntities(userConfig: Partial<GridIronConfig>): Promise<Array<Type<any>>> {
    const coreEntities = Object.values(coreEntityMap) as Array<Type<any>>
    const pluginEntities = getEntitiesFromPlugin(userConfig.plugins)

    const allEntities: Array<Type<any>> = coreEntities;
    for (const pluginEntity of pluginEntities) {
        if (allEntities.find(e => e.name === pluginEntity.name)) {
            throw new InternalServerError('Error Entity Name Conflict', {entityName: pluginEntity.name})
        } else {
            allEntities.push(pluginEntity)
        }
    }
    /*await GQLInits(allEntities)*/
    return allEntities
}

export async function GQLInits(allEntities: Array<Type<any>>): Promise<Array<Type<any>>> {
    await NestjsQueryTypeOrmModule.forFeature([...allEntities])
    return allEntities
}

export async function setExposedHeaders(config: Readonly<RuntimeGridIronConfig>) {
    const authTokenHeaderKey = config.authOptions.authTokenHeaderKey as string;
    const corsOptions = config.apiOptions.cors;
    if (typeof corsOptions !== 'boolean') {
        const {exposedHeaders} = corsOptions
        let exposedHeadersWithAuthKey: string[]
        if (!exposedHeaders) {
            exposedHeadersWithAuthKey = [authTokenHeaderKey]
        } else if (typeof exposedHeaders === 'string') {
            exposedHeadersWithAuthKey = exposedHeaders
                .split(',')
                .map(x => x.trim())
                .concat(authTokenHeaderKey)
        } else {
            exposedHeadersWithAuthKey = exposedHeaders.concat(authTokenHeaderKey)
        }
        corsOptions.exposedHeaders = exposedHeadersWithAuthKey
    }
}

function closeWorkerOnAppClose(app: INestApplication, worker: INestMicroservice) {
    const appPrototype = Object.getPrototypeOf(app)
    const appClose = appPrototype.close.bind(app)
    appPrototype.close = async () => {
        await worker.close()
        await appClose()
    }
}

function workerWelcomeMessage(config: GridIronConfig) {
    let transportString = ''
    let connectionString = ''
    const transport = (config.workerOptions && config.workerOptions.transport) || Transport.TCP
    transportString = ` with ${Transport[transport]} transport`;
    const options = (config.workerOptions as TcpClientOptions).options
    if (options) {
        const {port, host} = options
        connectionString = ` at ${host || 'localhost'}:${port}`;
    }
    Logger.info(`GridIron Worker started${transportString}${connectionString}`);
}

function logWelcomeMessage(config: GridIronConfig) {
    let version: string = GridironVersion

}
