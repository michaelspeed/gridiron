import {ConfigModule} from '../config';
import {ServiceModule} from '../service/service.module';
import {createDynamicGraphQLModulesForPlugin} from '../plugin/dynamic-plugin-api.module';
import {Module} from '@nestjs/common';
import {JobQueueModule} from '@gridiron/core/job-queue/job-queue.module';
import {AdministratorResolver} from './resolvers/admin/administrator.resolver';
import {AssetsResolver} from './resolvers/admin/assets.resolver';
import {RolesResolver} from './resolvers/admin/roles.resolver';
import {CollectionResolver} from './resolvers/admin/collection.resolver';
import {ChannelsResolver} from './resolvers/admin/channels.resolver';
import {StoreResolver} from './resolvers/admin/store.resolver';
import {TaxCategoryResolver} from './resolvers/admin/tax-category.resolver';
import {TaxRatesResolver} from './resolvers/admin/tax-rates.resolver';
import {UserResolver} from './resolvers/admin/user.resolver';
import {VendorResolver} from './resolvers/admin/vendor.resolver';
import {ZoneResolver} from './resolvers/admin/zone.resolver';
import {CountryResolver} from './resolvers/admin/country.resolver';
import {JwtModule} from '@nestjs/jwt';
import {NestjsQueryTypeOrmModule} from '@nestjs-query/query-typeorm';
import {coreEntityMap} from '../entity/coreEntityMap';
import {SeoResolver} from './resolvers/admin/seo.resolver';
import {adminServiceMap} from '../service/services/admin/adminServicesMap';
import {EventBusModule} from '../event-bus';
import {FacetsResolver} from './resolvers/admin/facets.resolver';
import {FacetsValueResolver} from './resolvers/admin/facets-value.resolver';
import {ProductResolver} from './resolvers/admin/product.resolver';
import {ProductVariantResolver} from './resolvers/admin/product-variant.resolver';
import {ProductOptionsResolver} from './resolvers/admin/product-options.resolver';
import {ProductOptionGroupResolver} from './resolvers/admin/product-option-group.resolver';
import {ProductVariantPriceResolver} from './resolvers/admin/product-variant-price.resolver';
import {ProductVariantAssetResolver} from './resolvers/admin/product-variant-asset.resolver';
import {ProductAssetResolver} from './resolvers/admin/product-asset.resolver';
import {VendorPlansResolver} from './resolvers/admin/vendor-plans.resolver';
import {VendorLicenseResolver} from './resolvers/admin/vendor-license.resolver';
import {BillingAgreementResolver} from './resolvers/admin/billing-agreement.resolver';
import {MenuResolver} from './resolvers/shop/menu.resolver';
import {StockKeepingResolver} from './resolvers/admin/stock-keeping.resolver';
import {SaleResolver} from './resolvers/admin/sale.resolver';
import {StockMovementResolver} from './resolvers/admin/stock-movement.resolver';
import {CancellationResolver} from './resolvers/admin/cancellation.resolver';
import {OrderResolver} from './resolvers/admin/order.resolver';
import {ZipResolver} from './resolvers/admin/zip.resolver';
import {AdminMenuResolver} from './resolvers/admin/menu.resolver';
import {PageResolver} from "./resolvers/admin/page.resolver";
import {AddressResolver} from "./resolvers/admin/address.resolver";
import {SettlementsResolver} from "./resolvers/admin/settlements.resolver";
import {ShopCollectionResolver} from "./resolvers/shop/collection.resolver";
import {ShopPageResolver} from "./resolvers/shop/page.resolver";
import {ShopProductVariantResolver} from "./resolvers/shop/productVariant.resolver";
import {ShopStoreResolver} from "./resolvers/shop/store.resolver";
import {ShopUserResolver} from "./resolvers/shop/user.resolver";
import {ShopAddressResolver} from "./resolvers/shop/address.resolver";
import {ShopSearchResolver} from "./resolvers/shop/search.resolver";
import {SearchFacetResolver} from "./resolvers/shop/facet.resolver";
import {OrderLineResolver} from "./resolvers/admin/order-line.resolver";
import {OrderItemResolver} from "./resolvers/admin/order-item.resolver";
import {PromotionVariantPriceResolver} from "./resolvers/admin/promotion-variant-price.resolver";
import {CartPriceResolver} from "./resolvers/admin/cart-price.resolver";
import {AccountsResolver} from "./resolvers/admin/accounts.resolver";
import {DeliveryResolver} from "./resolvers/admin/delivery.resolver";
import {PaymentMethodResolver} from "./resolvers/admin/paymentMethod.resolver";
import {SearchCartResolver} from "./resolvers/shop/cart.resolver";
import {ShopOrderResolver} from "./resolvers/shop/order.resolver";
import {StatisticResolver} from "./resolvers/admin/statistic.resolver";
import {StockBackLogResolver} from "./resolvers/admin/stock-back-log.resolver";
import {InvoiceResolver} from "./resolvers/admin/invoice.resolver";
import {RefundResolver} from "./resolvers/admin/refund.resolver";
import {PaymentResolver} from "./resolvers/admin/payment.resolver";
import {ViewCodesResolver} from "./resolvers/admin/view-codes.resolver";
import {HsnResolver} from "./resolvers/admin/hsn.resolver";
import {ServiceableResolver} from "./resolvers/admin/serviceable.resolver";
import {DefaultController} from "./controllers/default.controller";

const adminResolvers = [
    AdministratorResolver,
    AssetsResolver,
    BillingAgreementResolver,
    ChannelsResolver,
    CollectionResolver,
    CountryResolver,
    RolesResolver,
    StoreResolver,
    TaxCategoryResolver,
    TaxRatesResolver,
    UserResolver,
    VendorResolver,
    VendorPlansResolver,
    VendorLicenseResolver,
    ZoneResolver,
    SeoResolver,
    FacetsResolver,
    FacetsValueResolver,
    ProductResolver,
    ProductVariantResolver,
    ProductOptionsResolver,
    ProductOptionGroupResolver,
    ProductVariantPriceResolver,
    ProductVariantAssetResolver,
    ProductAssetResolver,
    StockKeepingResolver,
    SaleResolver,
    StockMovementResolver,
    CancellationResolver,
    OrderResolver,
    ZipResolver,
    AdminMenuResolver,
    PageResolver,
    AddressResolver,
    SettlementsResolver,
    OrderLineResolver,
    OrderItemResolver,
    PromotionVariantPriceResolver,
    CartPriceResolver,
    AccountsResolver,
    DeliveryResolver,
    PaymentMethodResolver,
    StatisticResolver,
    StockBackLogResolver,
    InvoiceResolver,
    RefundResolver,
    PaymentResolver,
    ViewCodesResolver,
    HsnResolver,
    ServiceableResolver
]

const shopResolvers = [
    MenuResolver,
    ShopCollectionResolver,
    ShopPageResolver,
    ShopProductVariantResolver,
    ShopStoreResolver,
    ShopUserResolver,
    ShopAddressResolver,
    ShopSearchResolver,
    SearchFacetResolver,
    SearchCartResolver,
    ShopOrderResolver
]

@Module({
    imports: [ConfigModule],
    exports: [ConfigModule]
})
export class ApiSharedModule {}

@Module({
    imports: [
        ServiceModule.forRoot(),
        ApiSharedModule,
        EventBusModule,
        JobQueueModule,
        JwtModule.register({
            secretOrPrivateKey: 'gridironMaster',
            signOptions: {
                expiresIn: '365d'
            }
        }),
        NestjsQueryTypeOrmModule.forFeature([...Object.values(coreEntityMap)]),
        ...createDynamicGraphQLModulesForPlugin('admin'),
    ],
    providers: [...adminResolvers, ...adminServiceMap],
    exports: [...adminResolvers],
    controllers: [DefaultController]
})
export class AdminApiModule {}

@Module({
    imports: [
        ServiceModule.forRoot(),
        ApiSharedModule,
        JobQueueModule,
        NestjsQueryTypeOrmModule.forFeature([...Object.values(coreEntityMap)]),
        ...createDynamicGraphQLModulesForPlugin('shop')
    ],
    providers: [...shopResolvers],
    exports: [...shopResolvers]
})
export class ShopApiModule {}
