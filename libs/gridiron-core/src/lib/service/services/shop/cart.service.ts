import {Injectable} from "@nestjs/common";
import {InjectConnection} from "@nestjs/typeorm";
import {Connection} from "typeorm";
import {Cart, CartItem, ProductVariant, ProductVariantPrice, User} from "../../../entity";

@Injectable()
export class ShopCartService {
    constructor(
       @InjectConnection() readonly connection: Connection
    ) {}

    async getCart(userId: string): Promise<Cart> {
        return this.connection.getRepository(Cart).findOne({where:{user:{id: userId}}, relations: ['items']})
    }

    async addToCart(userId: string, variant: String, store: String, price: String, quantity: number): Promise<CartItem> {
        return new Promise(async (resolve, reject) => {
            const cart = await this.connection.getRepository(Cart).findOne({where:{user:{id: userId}}})
            if (cart) {
                const cartItem = new CartItem()
                cartItem.price = await this.connection.getRepository(ProductVariantPrice).findOne({where:{id: price}})
                cartItem.variant = await this.connection.getRepository(ProductVariant).findOne({where:{id: variant}})
                cartItem.cart = cart
                cartItem.quantity = quantity
                cartItem.save().then(value => {
                    resolve(value)
                }).catch(error => reject(error))
            } else {
                const newcart = new Cart()
                newcart.user = await this.connection.getRepository(User).findOne({where:{id: userId}})
                newcart.save()
                    .then(async value => {
                        const cartItem = new CartItem()
                        cartItem.price = await this.connection.getRepository(ProductVariantPrice).findOne({where:{id: price}})
                        cartItem.variant = await this.connection.getRepository(ProductVariant).findOne({where:{id: variant}})
                        cartItem.cart = value
                        cartItem.quantity = quantity
                        cartItem.save().then(value1 => {
                            resolve(value1)
                        }).catch(error => reject(error))
                    })
            }
        })
    }

    async removeCartItem(cartId: string): Promise<CartItem> {
        return new Promise(async (resolve, reject) => {
            const cartItem = await this.connection.getRepository(CartItem).findOne({where:{id: cartId}})
            cartItem.remove()
                .then(() => {
                    resolve(cartItem)
                }).catch(error => reject(error))
        })
    }
}
