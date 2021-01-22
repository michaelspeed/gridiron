import {DynamicModule} from '@nestjs/common';
import {getModuleMetadata, graphQLResolversFor, isDynamicModule} from './plugin-metadata';
import {getConfig} from '../config/config-helpers';
import {notNullOrUndefined, Type} from '../common';

const dynamicApiModuleClassMap: { [name: string]: Type<any> } = {};

export function createDynamicGraphQLModulesForPlugin(apiType: 'shop' | 'admin'): DynamicModule[] {
    return getConfig()
        .plugins.map(plugin => {
            const pluginModule = isDynamicModule(plugin) ? plugin.module : plugin;
            const resolvers = graphQLResolversFor(plugin, apiType) || []
            if (resolvers.length) {
                const className = dynamicClassName(pluginModule, apiType)
                dynamicApiModuleClassMap[className] = class {}
                Object.defineProperty(dynamicApiModuleClassMap[className], 'name', {value: className})
                const {imports, providers} = getModuleMetadata(pluginModule)
                return {
                    module: dynamicApiModuleClassMap[className],
                    imports,
                    providers: [...providers, ...resolvers]
                }
            }
        }).filter(notNullOrUndefined)
}

export function getDynamicGraphQLModulesForPlugins(apiType: 'shop' | 'admin'): Array<Type<any>> {
    return getConfig()
        .plugins.map(plugin => {
            const pluginModule = isDynamicModule(plugin) ? plugin.module : plugin;
            const resolvers = graphQLResolversFor(plugin, apiType) || []
            const className = dynamicClassName(pluginModule, apiType)
            return dynamicApiModuleClassMap[className]
        }).filter(notNullOrUndefined)
}

function dynamicClassName(module: Type<any>, apiType: 'shop' | 'admin'): string {
    return module.name + `Dynamic` + (apiType === 'shop' ? 'Shop' : 'Admin') + 'Module';
}
