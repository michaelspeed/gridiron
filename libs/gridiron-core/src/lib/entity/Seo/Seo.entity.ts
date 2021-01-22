import {BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {FilterableField, PagingStrategies, Relation} from '@nestjs-query/query-graphql';
import {Field, ID, ObjectType} from '@nestjs/graphql';
import {Collection, ProductVariant} from '..';

@ObjectType('Seo', {isAbstract: true})
@Entity({name: 'seo'})
@Relation('collection', () => Collection, {nullable: true, pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Relation('variant', () => ProductVariant, {nullable: true, pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
export class Seo extends BaseEntity {

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
    @Column({ type: Date, nullable: true })
    deletedAt: Date | null

    @FilterableField()
    @Column()
    urlKey: string

    @FilterableField()
    @Column()
    metatitle: string

    @Field(() => [String], {nullable: true})
    @Column({type: 'simple-array'})
    metakeywords: string[]

    @Field()
    @Column()
    metadesc: string

    @OneToOne(type => Collection, col => col.seo)
    collection: Collection

    @OneToOne(type => ProductVariant, variant => variant.seo)
    @JoinColumn()
    variant: ProductVariant
}
