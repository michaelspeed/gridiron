import {DocumentNode} from 'graphql';
import {ModuleMetadata} from '@nestjs/common/interfaces';
import {MODULE_METADATA} from '@nestjs/common/constants';
import {Module} from '@nestjs/common';
import {pick, Type} from '../common';
import {RuntimeGridIronConfig} from '../config';
import {PLUGIN_METADATA} from './plugin-metadata';

export interface GridironPluginMetadata extends ModuleMetadata {
    configuration?: PluginConfigurationFn
    shopApiExtensions?: APIExtensionDefinition
    adminApiExtensions?: APIExtensionDefinition
    workers?: Array<Type<any>>
    entities?: Array<Type<any>>
}

export interface APIExtensionDefinition {
    schema?: DocumentNode | (() => DocumentNode);
    resolvers: Array<Type<any>> | (() => Array<Type<any>>);
}

export type PluginConfigurationFn = (
    config: RuntimeGridIronConfig
) => RuntimeGridIronConfig | Promise<RuntimeGridIronConfig>

export function GridironPlugin(pluginMetadata: GridironPluginMetadata): ClassDecorator {
    return (target: Function) => {
        for (const metadataProperty of Object.values(PLUGIN_METADATA)) {
            const property = metadataProperty as keyof GridironPluginMetadata
            if (pluginMetadata[property] !== null) {
                Reflect.defineMetadata(property, pluginMetadata[property], target)
            }
        }
        const nestModuleMetadata = pick(pluginMetadata, Object.values(MODULE_METADATA) as any)
        Module(nestModuleMetadata)(target)
    }
}

export interface OnGridironBootstrap {
    onGridironBootstrap(): void | Promise<void>
}

export interface OnGridironWorkerBootstrap {
    onGridironWorkerBootstrap(): void | Promise<void>
}

export interface OnGridironClose {
    onGridironClose(): void | Promise<void>
}

export interface OnGridironWorkerClose {
    onGridironWorkerClose(): void | Promise<void>
}

export type PluginLifecycleMethods = OnGridironBootstrap &
    OnGridironWorkerBootstrap &
    OnGridironClose &
    OnGridironWorkerClose
