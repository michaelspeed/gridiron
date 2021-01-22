import {
    BaseEntity, Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {FilterableField} from '@nestjs-query/query-graphql';
import {ID, ObjectType} from '@nestjs/graphql';
import {Collection, Product, ProductVariant, User} from '..';

@ObjectType('View', {isAbstract: true})
@Entity({name: 'view'})
export class View extends BaseEntity {

    @FilterableField(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @FilterableField()
    @CreateDateColumn()
    createdAt: Date;

    @FilterableField()
    @UpdateDateColumn()
    updatedAt: Date;

    @Column({type: "text"})
    slug: string

    @ManyToOne(type => User, user => user.view)
    user: User

    @ManyToOne(type => ProductVariant, prv => prv.view)
    variant: ProductVariant

    @ManyToOne(type => Collection, coll => coll.views)
    collection: Collection

    @ManyToOne(type => Product, prod => prod.views)
    product: Product
}
