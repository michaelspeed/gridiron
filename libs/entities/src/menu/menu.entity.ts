import {Field, ID, ObjectType, registerEnumType} from '@nestjs/graphql';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity, JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    Tree,
    TreeChildren,
    TreeParent,
    UpdateDateColumn
} from 'typeorm';
import {Connection, FilterableField, PagingStrategies, Relation} from '@nestjs-query/query-graphql';
import {Asset} from "../";
import { MenuBuilderTypes } from '../enums/MenuBuilderTypes';

registerEnumType(MenuBuilderTypes, {
    name: 'MenuBuilderTypes'
})

@ObjectType('Menu', {isAbstract: true})
@Entity({name: 'menu'})
@Tree("nested-set")
@Connection('children', () => Menu, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Relation('parent', () => Menu, {nullable: true, pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Relation('asset', () => Asset, {nullable: true, pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
export class Menu extends BaseEntity {
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
    title: string;

    @FilterableField()
    @Column({nullable: true})
    targetId: string;

    @FilterableField(() => MenuBuilderTypes)
    @Column({enum: MenuBuilderTypes, type: 'enum'})
    target: MenuBuilderTypes;

    @Field(() => [Menu])
    @TreeChildren()
    children: Menu[]

    @TreeParent()
    parent: Menu

    @OneToOne(() => Asset, asset => asset.menu)
    @JoinColumn()
    asset: Asset
}