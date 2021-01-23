import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {Field, ID, ObjectType} from '@nestjs/graphql';
import {Connection, FilterableField, PagingStrategies, Relation} from '@nestjs-query/query-graphql';
import {Product, ProductOption} from '../';

@ObjectType('ProductOptionGroup', {isAbstract: true})
@Entity({name: 'productOptionGroup'})
@Connection('options', () => ProductOption, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Relation('product', () => Product, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
export class ProductOptionGroup extends BaseEntity {
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
    name: string;

    @FilterableField()
    @Column()
    code: string;

    @Field(() => Product)
    @ManyToOne(type => Product, prod => prod.options)
    product: Product

    @Field(() => [ProductOption])
    @OneToMany(type => ProductOption, options => options.group)
    options: ProductOption[]
}
