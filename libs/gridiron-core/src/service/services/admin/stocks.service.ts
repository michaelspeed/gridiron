import {Injectable} from '@nestjs/common';
import {InjectConnection} from '@nestjs/typeorm';
import {Connection} from 'typeorm';
import {ProductVariant, StockKeeping, Store, StoreTypeEnum, Vendor} from '../../../entity';
import {StockKeepingType} from '../../../enums/StockKeepingType';

@Injectable()
export class StocksService {
    constructor(
        @InjectConnection() private readonly connection: Connection
    ) {}

    createOrUpdateStock(
        quantity: number,
        threshold: number,
        multiple: boolean,
        backorder: boolean,
        stockstatus: boolean,
        sku: string,
        variantId?: string,
        storeId?: string,
        stockId?: string,
        type?: StockKeepingType,
    ): Promise<StockKeeping> {
        return new Promise<StockKeeping>(async (resolve, reject) => {
            if(!stockId) {
                const newstock = new StockKeeping()
                newstock.quantity = quantity
                newstock.threshold = threshold
                newstock.multiple = multiple
                newstock.backorder = backorder
                newstock.stockstatus = stockstatus
                newstock.sku = sku
                newstock.available_quantity = quantity
                const varnts = await this.connection.getRepository(ProductVariant).findOne({where:{id: variantId}})
                newstock.variant = varnts
                newstock.type = type
                const store = await this.connection.getRepository(Store).findOne({where:{id: storeId}})
                newstock.store = store
                this.connection.getRepository(StockKeeping).save(newstock)
                    .then(value => resolve(value)).catch(error => reject(error))
            } else {
                const existingeye = await this.connection.getRepository(StockKeeping).findOne({where:{id: stockId}})
                existingeye.quantity = quantity
                existingeye.threshold = threshold
                existingeye.multiple = multiple
                existingeye.backorder = backorder
                existingeye.stockstatus = stockstatus
                existingeye.sku = sku
                this.connection.getRepository(StockKeeping).save(existingeye)
                    .then(value => resolve(value)).catch(error => reject(error))
            }
        })
    }

    getStockVariantWithVendor(variantId: string, vendorId?: string): Promise<StockKeeping> {
        return new Promise<StockKeeping>(async (resolve, reject) => {
            if (!vendorId) {
                const store = await this.connection.getRepository(Store).findOne({where:{type: StoreTypeEnum.DEFAULT}})
                this.connection.getRepository(StockKeeping).findOne({
                    where:{
                        store: {
                            id: store.id
                        },
                        variant: {
                            id: variantId
                        }
                    }
                }).then(value => resolve(value)).catch(error => reject(error))
            } else {
                const vendor = await this.connection.getRepository(Vendor).findOne({where:{id: vendorId}, relations: ['store']})
                this.connection.getRepository(StockKeeping).findOne({
                    where:{
                        store: {
                            id: vendor.store.id
                        },
                        variant: {
                            id: variantId
                        }
                    }
                }).then(value => resolve(value)).catch(error => reject(error))
            }
        })
    }

    getStocksForStore(storeId?: string): Promise<StockKeeping[]> {
        return new Promise(async (resolve, reject) => {
            if (storeId) {
                this.connection.getRepository(StockKeeping).find({
                    where:{
                        store:{
                            id: storeId
                        }
                    },
                    relations: ['variant']
                }).then(value => resolve(value)).catch(error => reject(error))
            } else {
                const defstore = await this.connection.getRepository(Store).findOne({where:{type: StoreTypeEnum.DEFAULT}})
                this.connection.getRepository(StockKeeping).find({
                    where:{
                        store:{
                            id: defstore.id
                        }
                    },
                    relations: ['variant']
                }).then(value => resolve(value)).catch(error => reject(error))
            }
        })
    }
}
