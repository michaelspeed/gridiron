import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {ID, ObjectType} from '@nestjs/graphql';
import {Connection, FilterableField, PagingStrategies, Relation} from '@nestjs-query/query-graphql';
import { ProductVariant } from '../product-variant/product-variant.entity';
import { ProductOptionGroup } from '../product-option-group/product-option-group.entity';

@ObjectType('ProductOption', {isAbstract: true})
@Entity({name: 'productOption'})
@Connection('variant', () => ProductVariant, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Relation('group', () => ProductOptionGroup, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
export class ProductOption extends BaseEntity {
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
    name: string

    @FilterableField()
    @Column()
    code: string;

    @ManyToOne(() => ProductOptionGroup, group => group.options)
    group: ProductOptionGroup

}
