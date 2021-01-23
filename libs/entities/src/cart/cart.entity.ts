import {BaseEntity, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {FilterableField} from '@nestjs-query/query-graphql';
import {Field, ID, ObjectType} from '@nestjs/graphql';
import { CartItem } from './cartItem.entity';
import { User } from '../user/user.entity';

@ObjectType('Cart', {isAbstract: true})
@Entity({name: 'cart'})
export class Cart extends BaseEntity {

    @FilterableField(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => [CartItem])
    @OneToMany(() => CartItem, item => item.cart)
    items: CartItem[]

    @Field(() => User, {nullable: true})
    @OneToOne(() => User, user => user.cart)
    @JoinColumn()
    user: User

}
