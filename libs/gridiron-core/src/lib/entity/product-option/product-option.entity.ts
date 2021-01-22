import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {ID, ObjectType} from '@nestjs/graphql';
import {Connection, FilterableField, PagingStrategies, Relation} from '@nestjs-query/query-graphql';
import {ProductOptionGroup, ProductVariant} from '../';

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

    @ManyToOne(type => ProductOptionGroup, group => group.options)
    group: ProductOptionGroup

}
