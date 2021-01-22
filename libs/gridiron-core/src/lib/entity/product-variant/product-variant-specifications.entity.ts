import {Field, ID, ObjectType} from '@nestjs/graphql';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {FilterableField, PagingStrategies, Relation} from '@nestjs-query/query-graphql';
import {ProductVariant} from '../';
import GraphQLJSON from 'graphql-type-json';

@ObjectType('ProductVariantSpecs', {isAbstract: true})
@Entity({name: 'product-variant-specs'})
@Relation('variant', () => ProductVariant, {nullable: true, pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
export class ProductVariantSpecifications extends BaseEntity {
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

    @Field(() => GraphQLJSON)
    @Column('simple-json')
    specs: JSON

    @Field(() => ProductVariant)
    @OneToOne(() => ProductVariant, variant => variant.specs)
    variant: ProductVariant
}
