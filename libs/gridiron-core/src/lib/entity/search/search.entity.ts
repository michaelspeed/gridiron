import {ID, ObjectType} from "@nestjs/graphql";
import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {FilterableField} from "@nestjs-query/query-graphql";

@ObjectType('Search', {isAbstract: true})
@Entity({name: 'search'})
export class Search extends BaseEntity {
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
    search: string

    @FilterableField()
    @Column()
    userId: string
}
