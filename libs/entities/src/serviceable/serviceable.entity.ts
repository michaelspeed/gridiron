import {ID, ObjectType, registerEnumType} from "@nestjs/graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {
    FilterableField,
    PagingStrategies,
    FilterableConnection
} from "@nestjs-query/query-graphql";
import { ServiceableOrderTypes, ServiceableTypes } from "../enums/ServiceableTypes";
import { Vendor } from "../vendor/vendor.entity";
import { Product } from "../product/product.entity";

registerEnumType(ServiceableTypes, {
    name: 'ServiceableTypes'
})

registerEnumType(ServiceableOrderTypes, {
    name: 'ServiceableOrderTypes'
})

@ObjectType('Serviceable', {isAbstract: true})
@Entity({name: 'serviceable'})
@FilterableConnection('vendors', () => Vendor, {nullable: true, pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true, relationName: 'vendors'})
@FilterableConnection('product', () => Product, {nullable: true, pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true, relationName: 'product'})
export class Serviceable extends BaseEntity {
    @FilterableField(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @FilterableField()
    @CreateDateColumn()
    createdAt: Date;

    @FilterableField()
    @UpdateDateColumn()
    updatedAt: Date;

    @FilterableField()
    @Column()
    name: string;

    @FilterableField(() => ServiceableTypes)
    @Column({enum: ServiceableTypes, type: "enum", default: ServiceableTypes.PRODUCT})
    type: ServiceableTypes

    @FilterableField(() => ServiceableOrderTypes)
    @Column({enum: ServiceableOrderTypes, type: "enum", default: ServiceableOrderTypes.IMMEDIATE})
    mode: ServiceableOrderTypes

    @OneToMany(() => Vendor, vendor => vendor.serviceable)
    vendors: Vendor[]

    @OneToMany(() => Product, product => product.serviceable)
    product: Product[]

}
