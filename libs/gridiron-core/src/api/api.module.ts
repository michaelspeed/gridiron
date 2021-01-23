import {Module} from '@nestjs/common';
import {ConfigModule} from '../config';
import {GqlJson} from './config/scalars/GqlJson';
import {AdminApiModule, ApiSharedModule, ShopApiModule} from './api-internal-modules';
import {configureAdminGraphQLModule, configureShopGraphQLModule} from './config/graphql-module-config';
import {ServiceModule} from '../service/service.module';

@Module({
    imports: [
        AdminApiModule,
        configureAdminGraphQLModule(configService => ({
            apiType: 'admin',
            apiPath: configService.apiOptions.adminApiPath,
            playground: true,
            debug: true,
            // typePaths: [],
            typePaths: ['./admin.gql'],
            resolverModule: [
                AdminApiModule,
            ],
        })),
    ],
    providers: [GqlJson]
})
export class AdminGQLModule {}

@Module({
    imports: [
        ShopApiModule,
        configureShopGraphQLModule(configService => ({
            apiType: 'shop',
            apiPath: configService.apiOptions.shopApiPath,
            playground: true,
            debug: true,
            typePaths: [],
            resolverModule: [
                ShopApiModule,
            ],
        })),
    ],
    providers: [GqlJson]
})
export class ShopGQLModule {}

@Module({
    imports: [
        ServiceModule.forRoot(),
        ApiSharedModule,
        AdminGQLModule,
        ShopGQLModule
    ],
})
export class ApiModule {}
