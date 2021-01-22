import {Field, ID, Int, ObjectType} from "@nestjs/graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn, DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {FilterableField} from "@nestjs-query/query-graphql";
import {ProductVariant, User} from "@gridiron/core";

@ObjectType('Review', {isAbstract: true})
@Entity({name: 'review'})
export class Review extends BaseEntity {

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

    @Field(() => Int)
    @Column({type: "int"})
    stars: number

    @Field()
    @Column({type: "text"})
    text: string

    @Field(() => User)
    @ManyToOne(type => User, user => user.view)
    user: User

    @Field(() => ProductVariant)
    @ManyToOne(type => ProductVariant, prv => prv.reviews)
    variant: ProductVariant
}
