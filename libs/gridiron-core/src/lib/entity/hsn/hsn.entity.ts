import {ID, ObjectType} from "@nestjs/graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn, Entity, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Connection, FilterableConnection, FilterableField, PagingStrategies} from "@nestjs-query/query-graphql";
import {Product, ProductOptionGroup, ProductVariantPrice} from "..";

@ObjectType('Hsn', {isAbstract: true})
@Entity({name: 'hsn'})
@FilterableConnection('prod', () => Product, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true, relationName: 'prod'})
@FilterableConnection('price', () => ProductVariantPrice, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true, relationName: 'price'})
export class Hsn extends BaseEntity {
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
    @DeleteDateColumn()
    deletedAt?: Date;

    @FilterableField()
    @Column()
    code: string

    @FilterableField()
    @Column({type: "float", default: 0})
    value: number

    @OneToMany(type => Product, prod => prod.hsn)
    prod: Product[]

    @OneToMany(type => ProductVariantPrice, price => price.hsn)
    price: ProductVariantPrice[]
}
