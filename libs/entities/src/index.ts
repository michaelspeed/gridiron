export * from './address/address.entity'
export * from './administrator/administrator.entity'
export * from './asset/asset.entity'
export * from './asset/assets-folder.entity'
export * from './channel/channel.entity'
export * from './country/country.entity'
export * from './collection/collection.entity'
export * from './collection/collection-asset.entity'
export * from './customer/customer.entity'
export * from './customer-group/customer-group.entity'
export * from './facet/facet.entity'
export * from './facet-value/facet-value.entity'
export * from './global-settings/global-settings.entity'
export * from './history-entry/history-entry.entity'
export * from './history-entry/order-history-entry.entity'
export * from './order/order.entity'
export * from './order-item/order-item.entity'
export * from './order-line/order-line.entity'
export * from './pin/pin.entity'
export * from './product/product.entity'
export * from './user/user.entity'
export * from './vendor/vendor.entity'
export * from './vendorPin/vendorPin.entity'
export * from './tax-category/tax-category.entity'
export * from './tax-rate/tax-rate.entity'
export * from './zone/zone.entity'
export * from './Store/store.entity'
export * from './role/role.entity'
export * from './session/session.entity'
export * from './session/anonymous-session.entity'
export * from './session/authenticated-session.entity'
export * from './Seo/Seo.entity'
export * from './product/product-asset.entity'
export * from './product-variant/product-variant.entity'
export * from './product-variant/product-variant-asset.entity'
export * from './product-variant/product-variant-price.entity'
export * from './product-option/product-option.entity'
export * from './product-option-group/product-option-group.entity'
export * from './plans/vendor-plans'
export * from './plans/vendor-license'
export * from './billing-agreement/BillingAgreement'
export * from './product-variant/product-variant-specifications.entity'
export * from './cart/cart.entity'
export * from './view/view.entity'
export * from './billing-agreement/BillingAgreementRequest'
export * from './stock-movement/stock-keeping.entity'
export * from './stock-movement/cancellation.entity'
export * from './stock-movement/stock-movement.entity'
export * from './stock-movement/sale.entity'
export * from './Zip/zip.entity'
export * from './menu/menu.entity'
export * from './pages/page.entity'
export * from './Store/storeBalance.entity'
export * from './settlement/settlement.entity'
export * from './delivery/delivery.entity'
export * from './delivery/delivery-pool.entity'
export * from './search/search.entity'
export * from './promotion-variant/promotion-variant-price.entity'
export * from './promotion-variant/cart-price.entity'
export * from './Accounts/accounts.entity'
export * from './delivery/delivery-signin.entity'
export * from './delivery/delivery-stranded.entity'
export * from './payment/payment.entity'
export * from './payment-method/payment-method.entity'
export * from './cart/cartItem.entity'
export * from './stock-movement/stock-back-log.entity'
export * from './reviews/review.entity'
export * from './invoice/Invoice.entity'
export * from './refund/refund.entity'
export * from './reset-code/reset-code.entity'
export * from './view-codes/view-codes.entity'
export * from './hsn/hsn.entity'
export * from './serviceable/serviceable.entity'
export * from './serviceable/serviceableOrders.entity'
export * from './base/base.entity'

import {Address} from './address/address.entity';
import {AssetsFolder} from './asset/assets-folder.entity';
import {Administrator} from './administrator/administrator.entity';
import {Collection} from './collection/collection.entity';
import {Country} from './country/country.entity';
import {Channel} from './channel/channel.entity';
import {Asset} from './asset/asset.entity';
import {CollectionAsset} from './collection/collection-asset.entity';
import {Customer} from './customer/customer.entity';
import {CustomerGroup} from './customer-group/customer-group.entity';
import {Facet} from './facet/facet.entity';
import {FacetValue} from './facet-value/facet-value.entity';
import {Order} from './order/order.entity';
import {Product} from './product/product.entity';
import {GlobalSettings} from './global-settings/global-settings.entity';
import {Vendor} from './vendor/vendor.entity';
import {Fulfillment} from './fulfillment/fulfillment.entity';
import {Pin} from './pin/pin.entity';
import {OrderLine} from './order-line/order-line.entity';
import {OrderItem} from './order-item/order-item.entity';
import {HistoryEntry} from './history-entry/history-entry.entity';
import {OrderHistoryEntry} from './history-entry/order-history-entry.entity';
import {VendorPin} from './vendorPin/vendorPin.entity';
import {User} from './user/user.entity';
import {TaxCategory} from './tax-category/tax-category.entity';
import {TaxRate} from './tax-rate/tax-rate.entity';
import {Zone} from './zone/zone.entity';
import {Store} from './Store/store.entity';
import {Role} from './role/role.entity';
import {Session} from './session/session.entity';
import {Seo} from './Seo/Seo.entity';
import {ProductAsset} from './product/product-asset.entity';
import {ProductVariant} from './product-variant/product-variant.entity';
import {ProductVariantAsset} from './product-variant/product-variant-asset.entity';
import {ProductOption} from './product-option/product-option.entity';
import {ProductOptionGroup} from './product-option-group/product-option-group.entity';
import {ProductVariantPrice} from './product-variant/product-variant-price.entity';
import {VendorPlans} from './plans/vendor-plans';
import {VendorLicense} from './plans/vendor-license';
import {AnonymousSession} from './session/anonymous-session.entity';
import {AuthenticatedSession} from './session/authenticated-session.entity';
import {BillingAgreement} from './billing-agreement/BillingAgreement';
import {ProductVariantSpecifications} from './product-variant/product-variant-specifications.entity';
import {Cart} from './cart/cart.entity';
import {View} from './view/view.entity';
import {BillingAgreementRequest} from './billing-agreement/BillingAgreementRequest';
import {StockKeeping} from './stock-movement/stock-keeping.entity';
import {Cancellation} from './stock-movement/cancellation.entity';
import {StockMovement} from './stock-movement/stock-movement.entity';
import {Sale} from './stock-movement/sale.entity';
import {Zip} from './Zip/zip.entity';
import {Menu} from './menu/menu.entity';
import {Page} from "./pages/page.entity";
import {StoreBalance} from "./Store/storeBalance.entity";
import {Settlements} from "./settlement/settlement.entity";
import {Delivery} from "./delivery/delivery.entity";
import {DeliveryPool} from "./delivery/delivery-pool.entity";
import {Search} from "./search/search.entity";
import {PromotionVariantPrice} from "./promotion-variant/promotion-variant-price.entity";
import {CartPrice} from "./promotion-variant/cart-price.entity";
import {Accounts} from "./Accounts/accounts.entity";
import {DeliverySignIn} from "./delivery/delivery-signin.entity";
import {DeliveryStranded} from "./delivery/delivery-stranded.entity";
import {Payment} from "./payment/payment.entity";
import {PaymentMethod} from "./payment-method/payment-method.entity";
import {CartItem} from "./cart/cartItem.entity";
import {StockBackLog} from "./stock-movement/stock-back-log.entity";
import { Review } from './reviews/review.entity';
import {Invoice} from "./invoice/Invoice.entity";
import {Refund} from "./refund/refund.entity";
import {ResetCode} from "./reset-code/reset-code.entity";
import {ViewCodes} from "./view-codes/view-codes.entity";
import {Hsn} from "./hsn/hsn.entity";
import {Serviceable} from "./serviceable/serviceable.entity";
import {ServiceableOrders} from "./serviceable/serviceableOrders.entity";

export * from './enums'

export const coreEntityMap = {
    Address,
    Administrator,
    Asset,
    AssetsFolder,
    BillingAgreement,
    BillingAgreementRequest,
    Seo,
    Cart,
    Channel,
    Country,
    Collection,
    CollectionAsset,
    Customer,
    CustomerGroup,
    Cancellation,
    Facet,
    FacetValue,
    Fulfillment,
    GlobalSettings,
    Hsn,
    HistoryEntry,
    OrderHistoryEntry,
    Order,
    OrderItem,
    OrderLine,
    Pin,
    Product,
    ProductOption,
    ProductOptionGroup,
    ProductAsset,
    ProductVariant,
    ProductVariantPrice,
    ProductVariantAsset,
    ProductVariantSpecifications,
    User,
    Vendor,
    VendorPin,
    VendorPlans,
    VendorLicense,
    TaxCategory,
    TaxRate,
    Zone,
    Sale,
    Store,
    Session,
    StockKeeping,
    StockMovement,
    AuthenticatedSession,
    AnonymousSession,
    Role,
    View,
    Zip,
    Menu,
    Page,
    StoreBalance,
    Settlements,
    Delivery,
    DeliveryPool,
    Search,
    PromotionVariantPrice,
    CartPrice,
    Accounts,
    DeliverySignIn,
    DeliveryStranded,
    Payment,
    PaymentMethod,
    CartItem,
    StockBackLog,
    Review,
    Invoice,
    Refund,
    ResetCode,
    ViewCodes,
    Serviceable,
    ServiceableOrders
}
