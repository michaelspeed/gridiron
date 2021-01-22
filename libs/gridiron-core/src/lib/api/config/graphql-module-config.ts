import {GqlModuleOptions, GraphQLModule, GraphQLTypesLoader} from '@nestjs/graphql';
import path from 'path';
import {buildSchema, extendSchema, printSchema} from 'graphql';
import {DynamicModule} from '@nestjs/common';
import {ConfigModule, ConfigService} from '../../config';
import {getDynamicGraphQLModulesForPlugins} from '../../plugin/dynamic-plugin-api.module';
import {getPluginApiExtensions} from '../../plugin/plugin-metadata';
import {notNullOrUndefined} from '../../common';

export interface GraphQLApiOptions {
    apiType: 'shop' | 'admin';
    typePaths: string[];
    apiPath: string;
    debug: boolean;
    playground: boolean | any;
    // tslint:disable-next-line:ban-types
    resolverModule: any[];
}

export function configureAdminGraphQLModule(
    getOptions: (configService: ConfigService) => GraphQLApiOptions
): DynamicModule {
    return GraphQLModule.forRootAsync({
        useFactory: (
            configService: ConfigService,
            typesLoader: GraphQLTypesLoader
        ) => {
            return configureAdminGraphQLOptions(
                configService,
                typesLoader,
                getOptions(configService)
            )
        },
        inject: [ConfigService, GraphQLTypesLoader],
        imports: [ConfigModule]
    })
}

async function configureAdminGraphQLOptions(
    configService: ConfigService,
    typesLoader: GraphQLTypesLoader,
    options: GraphQLApiOptions
): Promise<GqlModuleOptions> {
    const dummyResolverType = {
        __resolveType() {
            return null
        }
    }

    return {
        path: '/' + options.apiPath,
        // autoSchemaFile: 'admin.gql',
        include: [...options.resolverModule, ...getDynamicGraphQLModulesForPlugins(options.apiType)],
        uploads: {
            maxFileSize: configService.assetOptions.uploadMaxFileSize,
        },
        typePaths: options.typePaths,
        // typePaths: [],
        playground: options.playground || false,
        debug: options.debug || false,
        context: (req: any) => req,
        cors: false,
        buildSchemaOptions: {
            skipCheck: true,
        },
        resolverValidationOptions: {
            allowResolversNotInSchema: true,
        },
        plugins: [
            ...configService.apiOptions.apolloServerPlugin
        ],
        installSubscriptionHandlers: true
    } as GqlModuleOptions

    async function createTypeDefs(apiType: 'shop' | 'admin'): Promise<string> {
        const normalizedPaths = options.typePaths.map(p => p.split(path.sep).join('/'))
        const typeDefs = await typesLoader.mergeTypesByPaths(normalizedPaths)
        let schema = buildSchema(typeDefs)
        getPluginApiExtensions(configService.plugins, apiType)
            .map(e => (typeof e.schema === 'function' ? e.schema() : e.schema))
            .filter(notNullOrUndefined)
            .forEach(documentNode => (schema = extendSchema(schema, documentNode)))
        return printSchema(schema)
    }
}

export function configureShopGraphQLModule(
    getOptions: (configService: ConfigService) => GraphQLApiOptions
): DynamicModule {
    return GraphQLModule.forRootAsync({
        useFactory: (
            configService: ConfigService,
            typesLoader: GraphQLTypesLoader
        ) => {
            return configureShopGraphQLOptions(
                configService,
                typesLoader,
                getOptions(configService)
            )
        },
        inject: [ConfigService, GraphQLTypesLoader],
        imports: [ConfigModule]
    })
}

async function configureShopGraphQLOptions(
    configService: ConfigService,
    typesLoader: GraphQLTypesLoader,
    options: GraphQLApiOptions
): Promise<GqlModuleOptions> {
    const dummyResolverType = {
        __resolveType() {
            return null
        }
    }

    return {
        path: '/' + options.apiPath,
        autoSchemaFile: 'shop.graphql',
        include: [...options.resolverModule, ...getDynamicGraphQLModulesForPlugins(options.apiType)],
        uploads: {
            maxFileSize: configService.assetOptions.uploadMaxFileSize,
        },
        playground: options.playground || false,
        debug: options.debug || false,
        context: (req: any) => req,
        cors: false,
        buildSchemaOptions: {
            skipCheck: true,
        },
        /*typePaths: [path.join(__dirname,'..', 'schema','shop', 'shop.graphql')],*/
        resolverValidationOptions: {
            allowResolversNotInSchema: true,
        },
        plugins: [
            ...configService.apiOptions.apolloServerPlugin
        ],
        installSubscriptionHandlers: true
    } as GqlModuleOptions

    async function createTypeDefs(apiType: 'shop' | 'admin'): Promise<string> {
        const normalizedPaths = options.typePaths.map(p => p.split(path.sep).join('/'))
        const typeDefs = await typesLoader.mergeTypesByPaths(normalizedPaths)
        let schema = buildSchema(typeDefs)
        getPluginApiExtensions(configService.plugins, apiType)
            .map(e => (typeof e.schema === 'function' ? e.schema() : e.schema))
            .filter(notNullOrUndefined)
            .forEach(documentNode => (schema = extendSchema(schema, documentNode)))
        return printSchema(schema)
    }
}
