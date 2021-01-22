import {
    BaseEntity, Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {ID, ObjectType} from "@nestjs/graphql";
import {FilterableField} from "@nestjs-query/query-graphql";

@ObjectType('ViewCode', {isAbstract: true})
@Entity({name: 'view-code'})
export class ViewCodes extends BaseEntity {
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
    @Column({type: "text"})
    value: string

    @FilterableField()
    @Column({type: "text"})
    description: string
}
