import {Injectable} from "@nestjs/common";
import {InjectConnection} from "@nestjs/typeorm";
import {Connection} from "typeorm";
import {
    Order,
    OrderItem,
    OrderLine,
    Payment,
    PaymentMethod,
    ProductVariantPrice,
    StockBackLog,
    StockKeeping,
    User
} from "../../../entity";
import {CartItem} from "../../../enums/cartInterface";
import {classToPlain} from "class-transformer";
import {OrderStageType, PaymentModes} from "@gridiron/core";
import {JwtService} from "@nestjs/jwt";
import axios from 'axios'
import {ShopPaymentService} from "./payment.service";

@Injectable()
export class ShopOrderService {
    constructor(
        @InjectConnection() private connection: Connection,
        private readonly jwtService: JwtService,
        private readonly paymentService: ShopPaymentService
    ) {}

    async DecryptToken(token: string): Promise<{userId: string}> {
        return new Promise(async (resolve, reject) => {
            const decoded: any = await this.jwtService.decode(token)
            resolve(decoded)
        })
    }

    async createShopOrder(items: CartItem[], userId: string, address: string, transaction?: string): Promise<Order> {
        return new Promise(async (resolve, reject) => {
            const prodVars: OrderLine[] = []
            let totalAmt = 0
            const getPaymentMode: PaymentMethod = await this.paymentService.getPaymentCodes()
            let amtRes

            for (const prod of items) {
                const prodVarPrice = await this.connection.getRepository(ProductVariantPrice).findOne({where:{id: prod.priceId}, relations: ['variant', 'tax', 'store']})
                const newOrderItem = new OrderItem()
                newOrderItem.quantity = prod.quantity
                newOrderItem.productVariant = prodVarPrice.variant
                newOrderItem.taxCategory = prodVarPrice.tax
                const orderitemsaved = await this.connection.getRepository(OrderItem).save(newOrderItem)
                const newOrderLine = new OrderLine()
                newOrderLine.store = prodVarPrice.store
                newOrderLine.priceField = classToPlain(prodVarPrice) as any
                newOrderLine.stage = OrderStageType.CREATED
                newOrderLine.item = orderitemsaved
                const orderlinesaved = await this.connection.getRepository(OrderLine).save(newOrderLine)
                prodVars.push(orderlinesaved)
                totalAmt = totalAmt + (prodVarPrice.price * prod.quantity)
                await this.processStock(prodVarPrice.id, prod.quantity)
            }

            if (transaction) {
                const getPaymentData = await axios.get(`https://${getPaymentMode.api}:${getPaymentMode.secretKey}@api.razorpay.com/v1/payments/${transaction}`)
                await axios.post(`https://${getPaymentMode.api}:${getPaymentMode.secretKey}@api.razorpay.com/v1/payments/${transaction}/capture`, {
                    amount: getPaymentData.data.amount,
                    currency: getPaymentData.data.currency
                }).then(value => {
                    console.log("incoming", value.data)
                    amtRes = value;
                }).catch(error => {
                    console.log("error", error.response.data.error)
                })
            }

            const neworder = new Order()
            neworder.user = await this.connection.getRepository(User).findOne({id: userId})
            neworder.line = prodVars
            neworder.address = address
            neworder.totalPrice = totalAmt
            if (transaction && amtRes.data.status === 'captured') {
                neworder.mode = amtRes.data.method
            } else {
                neworder.mode = PaymentModes.cod
            }
            const saveOrder = await this.connection.getRepository(Order).save(neworder)

            if (transaction && amtRes.data.status === 'captured') {
                const payment = new Payment()
                payment.amount = totalAmt
                payment.transactionId = transaction
                payment.order = saveOrder
                payment.metadata = amtRes.data
                const savePayment = await this.connection.getRepository(Payment).save(payment)
            }
            resolve(saveOrder)
        })
    }

    async processStock(priceId: string, quantity: number): Promise<StockBackLog> {
        return new Promise(async (resolve, reject) => {
            const prodVars = await this.connection.getRepository(ProductVariantPrice).findOne({where:{id: priceId}, relations: ['store']})
            const getStock = await this.connection.getRepository(StockKeeping).findOne({where:{store:{id: prodVars.store.id}, variant: {id: prodVars.id}}})
            if (!getStock || quantity > getStock.quantity) {
                let getBackLog = await this.connection.getRepository(StockBackLog).findOne({where:{store:{id: prodVars.store.id}, variant:{id: prodVars.id}}})
                if (getBackLog) {
                    getBackLog.quantity = getBackLog.quantity + quantity
                    const saveBlog = await this.connection.getRepository(StockBackLog).save(getBackLog)
                    resolve(saveBlog)
                } else {
                    getBackLog = new StockBackLog()
                    getBackLog.variant = prodVars
                    getBackLog.store = prodVars.store
                    getBackLog.quantity = quantity
                    const saveBlog = await this.connection.getRepository(StockBackLog).save(getBackLog)
                    resolve(saveBlog)
                }
            }
        })
    }

    async getMyOrders(token: string): Promise<Order[]> {
        return new Promise(async (resolve, reject) => {
            const user = await this.DecryptToken(token)
            await this.connection.getRepository(Order)
                .find({where:{user:{id: user.userId}}, relations: ['line', 'line.item', 'line.item.productVariant']})
                .then(value => resolve(value))
                .catch(error => reject(error))
        })
    }

    async getSingleOrder(id: string): Promise<Order> {
        return new Promise(async (resolve, reject) => {
            await this.connection.getRepository(Order)
                .findOne({where:{id: id}, relations: ['line', 'line.item', 'line.store', 'line.item.productVariant', 'payment']})
                .then(value => resolve(value))
                .catch(error => reject(error))
        })
    }
}
