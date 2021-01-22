import {GridIronConfig, RuntimeGridIronConfig} from './config';
import {ConnectionOptions, createConnection} from 'typeorm';
import {getConfig, setConfig} from './config/config-helpers';
import {InternalServerError, Type} from './common';
import {coreEntityMap} from './entity/coreEntityMap';
import {getConfigurationFunction, getEntitiesFromPlugin} from './plugin/plugin-metadata';

export interface MigrationOptions {
    name: string
    outputDir?: string
}

export async function runMigrations(useConfig: Partial<GridIronConfig>) {
    const config = await preBootStrapServer(useConfig)
    const connections = await createConnection(config.dbConnectionOptions)
    await connections.close()
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

export async function preBootStrapServer(userConfig: Partial<GridIronConfig>): Promise<Readonly<RuntimeGridIronConfig>> {
    if (userConfig) {
        await setConfig(userConfig)
    }
    const entities = await getAllEntities(userConfig)
    console.log(entities)
    await setConfig({
        dbConnectionOptions: {
            entities
        }
    })
    let config = getConfig()
    config = await runPluginConfiguration(config)
    return config
}

export async function revertLastMigration(userConfig: Partial<GridIronConfig>) {
    const config = await preBootStrapServer(userConfig)
    const connections = await createConnection(createConnectionOptions(config))
    await connections.undoLastMigration({transaction: 'each'})
    await connections.close()
}

function createConnectionOptions(userConfig: Partial<GridIronConfig>): ConnectionOptions {
    return Object.assign({logging: ['query', 'error', 'schema']}, userConfig.dbConnectionOptions)
}
