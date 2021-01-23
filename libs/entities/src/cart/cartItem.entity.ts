import {Field, ID, ObjectType} from "@nestjs/graphql";
import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {FilterableField} from "@nestjs-query/query-graphql";
import { Cart } from "./cart.entity";
import { ProductVariant } from "../product-variant/product-variant.entity";
import { Store } from "../Store/store.entity";
import { ProductVariantPrice } from "../product-variant/product-variant-price.entity";

@ObjectType('CartItem', {isAbstract: true})
@Entity('catritem')
export class CartItem extends BaseEntity {

    @FilterableField(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column({default: 0})
    quantity: number

    @Field(() => Cart)
    @ManyToOne(() => Cart, cart => cart.items)
    cart: Cart

    @Field(() => ProductVariant)
    @ManyToOne(() => ProductVariant, variant => variant.carts)
    variant: ProductVariant

    @Field(() => Store)
    @ManyToOne(() => Store, store => store.cart)
    store: Store

    @Field(() => ProductVariantPrice)
    @ManyToOne(() => ProductVariantPrice, price => price.cartItem)
    price: ProductVariantPrice
}
