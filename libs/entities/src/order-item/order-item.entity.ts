import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {Field, ID, ObjectType} from '@nestjs/graphql';
import {FilterableField, PagingStrategies, Relation} from '@nestjs-query/query-graphql';
import {OrderLine, ProductVariant, TaxRate} from '..';

@ObjectType('OrderItem', {isAbstract: true})
@Entity({name: 'order-item'})
@Relation('productVariant', () => ProductVariant, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Relation('taxCategory', () => TaxRate, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Relation('line', () => OrderLine, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
export class OrderItem extends BaseEntity {
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
    quantity: number;

    @Field(() => ProductVariant)
    @ManyToOne(() => ProductVariant, variant => variant.line)
    productVariant: ProductVariant;

    @ManyToOne(() => TaxRate)
    taxCategory: TaxRate;

    @OneToOne(() => OrderLine, line => line.item)
    line: OrderLine
}
