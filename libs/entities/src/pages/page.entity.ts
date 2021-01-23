import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {FilterableField} from "@nestjs-query/query-graphql";
import {Field, ID, ObjectType, registerEnumType} from "@nestjs/graphql";
import GraphQLJSON from "graphql-type-json";
import { PageCategory, PageType } from "../enums/PageType";

registerEnumType(PageType, {
    name: 'PageType'
})

registerEnumType(PageCategory, {
    name: 'PageCategory'
})

@ObjectType('Page', {isAbstract: true})
@Entity('page')
export class Page extends BaseEntity {

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
    @Column({default: ''})
    title: string

    @FilterableField()
    @Column({default: ''})
    targetId: string

    @Field(() => GraphQLJSON, {nullable: true})
    @Column({nullable: true, type: "simple-json"})
    single: string

    @Field(() => [String],{nullable: true})
    @Column({nullable: true, type: "simple-array"})
    list: string[]

    @FilterableField(() => PageType)
    @Column({enum: PageType, type: "enum", default: PageType.LIST})
    pageType: PageType

    @FilterableField(() => PageCategory)
    @Column({enum: PageCategory, type: "enum", default: PageCategory.HOME})
    pageCategory: PageCategory

}
