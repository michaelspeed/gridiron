import {DynamicModule, HttpModule, Module, OnModuleInit} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule, ConfigService} from '../config';
import {AdministratorService} from './services/admin/administrator.service';
import {AssetsService} from './services/admin/assets.service';
import {CategoryService} from './services/admin/category.service';
import {ChannelsService} from './services/admin/channels.service';
import {CollectionService} from './services/admin/collection.service';
import {CountryService} from './services/admin/country.service';
import {StoreService} from './services/admin/store.service';
import {RolesService} from './services/admin/roles.service';
import {TaxCategoryService} from './services/admin/tax-category.service';
import {UserService} from './services/admin/user.service';
import {VendorService} from './services/admin/vendor.service';
import {ZoneService} from './services/admin/zone.service';
import {JwtModule} from '@nestjs/jwt';
import {EventBusModule} from '../event-bus';
import {WorkerServiceModule} from '../worker/worker-service.module';
import {JobQueueModule} from '../job-queue/job-queue.module';
import {ListQueryBuilder} from './helpers/list-query-builder/list-query-builder';
import {ProductService} from './services/admin/product.service';
import {ProductVariantsService} from './services/admin/product-variants.service';
import {SessionService} from './services/global/session.service';
import {VendorPlanService} from './services/admin/vendor-plan.service';
import {BillingAgreementService} from './services/admin/billing-agreement.service';
import {MenuService} from './services/shop/menu.service';
import {SeoService} from './services/admin/seo.service';
import {StocksService} from './services/admin/stocks.service';
import {ZipService} from './services/admin/zip.service';
import {ZipSubscriber} from './services/subscribers/ZipSubscriber';
import {AdminMenuService} from './services/admin/menu.service';
import {PageService} from "./services/admin/page.service";
import {ShopCollectionService} from "./services/shop/collection.service";
import {ShopPagesService} from "./services/shop/pages.service";
import {ShopProductsService} from "./services/shop/products.service";
import {ShopStoreService} from "./services/shop/store.service";
import {ShopUserService} from "./services/shop/user.service";
import {ShopAddressService} from "./services/shop/address.service";
import {ShopSearchService} from "./services/shop/search.service";
import {ShopFacetService} from "./services/shop/facet.service";
import {OrderService} from "./services/admin/order.service";
import {PromotionPriceVariantService} from "./services/admin/promotion-price-variant.service";
import {AccountsService} from "./services/admin/accounts.service";
import {DeliveryService} from "./services/admin/delivery.service";
import {OrderLineSubscriber} from "./services/subscribers/OrderSubscriber";
import {PaymentMethodService} from "./services/admin/paymentMethod.service";
import {ShopCartService} from "./services/shop/cart.service";
import {ShopOrderService} from "./services/shop/order.service";
import {ShopPaymentService} from "./services/shop/payment.service";
import {ReviewSubscriber} from "./services/subscribers/ReviewSubscriber";
import {StatisticsService} from "./services/admin/statistics.service";
import {StockSubscriber} from "./services/subscribers/StockSubscriber";
import {OrderController} from "./controllers/order.controller";
import {RefundService} from "./services/admin/refund.service";
import {RefundSubscriber} from "./services/subscribers/RefundSubscriber";
import {CollectionSubscriber} from "./services/subscribers/CollectionSubscriber";
import {GlobalCollectionsService} from "./services/global/collection.service";
import {CollectionController} from "./controllers/collection.controller";
import {SettlementService} from "./services/admin/settlement.service";
import { ServiceableService } from './services/admin/serviceable.service';

export const adminServices = [
    AdministratorService,
    AssetsService,
    BillingAgreementService,
    CategoryService,
    ChannelsService,
    CollectionService,
    CountryService,
    RolesService,
    StoreService,
    TaxCategoryService,
    UserService,
    VendorService,
    ZoneService,
    ProductService,
    ProductVariantsService,
    VendorPlanService,
    SeoService,
    StocksService,
    ZipService,
    AdminMenuService,
    PageService,
    OrderService,
    PromotionPriceVariantService,
    AccountsService,
    DeliveryService,
    PaymentMethodService,
    StatisticsService,
    RefundService,
    SettlementService,
    ServiceableService
]

export const globalServices = [
    SessionService,
    OrderLineSubscriber,
    CollectionSubscriber,
    GlobalCollectionsService
]

export const shopServices = [
    MenuService,
    ShopCollectionService,
    ShopPagesService,
    ShopProductsService,
    ShopStoreService,
    ShopUserService,
    ShopAddressService,
    ShopSearchService,
    ShopFacetService,
    ShopCartService,
    ShopOrderService,
    ShopPaymentService
]

let defaultTypeOrmModule: DynamicModule;
let workerTypeOrmModule: DynamicModule;


@Module({
    imports: [
        ConfigModule,
        EventBusModule,
        WorkerServiceModule,
        JobQueueModule,
        JwtModule.register({
            secretOrPrivateKey: 'gridironMaster',
            signOptions: {
                expiresIn: '365d'
            }
        }),
    ],
    providers: [
        ...adminServices.map(item => item),
        ...globalServices.map(item => item),
        ...shopServices.map(item => item),
        ListQueryBuilder
    ],
    exports: [
        ...adminServices.map(item => item),
        ...globalServices.map(item => item),
        ...shopServices.map(item => item),
        ListQueryBuilder
    ]
})
export class ServiceCoreModule {
    constructor() {}
}

const workerController = [
    OrderController,
    CollectionController
]

@Module({
    imports: [
        ServiceCoreModule,
        HttpModule
    ],
    exports: [ServiceCoreModule]
})
export class ServiceModule {
    static forRoot(): DynamicModule {
        if (!defaultTypeOrmModule) {
            defaultTypeOrmModule = TypeOrmModule.forRootAsync({
                imports: [ConfigModule],
                useFactory: (configService: ConfigService) => {
                    return {
                        subscribers: [
                            ZipSubscriber,
                            // OrderLineSubscriber,
                            ReviewSubscriber,
                            StockSubscriber,
                            RefundSubscriber
                        ],
                        ...configService.dbConnectionOptions
                    }
                },
                inject: [ConfigService]
            })
        }
        return {
            module: ServiceModule,
            imports: [defaultTypeOrmModule]
        }
    }

    static forWorker(): DynamicModule {
        if (!workerTypeOrmModule) {
            workerTypeOrmModule = TypeOrmModule.forRootAsync({
                imports: [ConfigModule],
                useFactory: (configService: ConfigService) => {
                    const {dbConnectionOptions, workerOptions} = configService
                    if (workerOptions.runInMainProcess) {
                        return {
                            ...dbConnectionOptions,
                            name: 'default',
                            keepConnectionAlive: true
                        }
                    } else {
                        return {
                            ...dbConnectionOptions
                        }
                    }
                },
                inject: [ConfigService]
            })
        }
        return {
            module: ServiceModule,
            imports: [workerTypeOrmModule, ConfigModule],
            controllers: workerController
        }
    }

    static forPlugin(): DynamicModule {
        return {
            module: ServiceModule,
            imports: [TypeOrmModule.forFeature()]
        }
    }
}
