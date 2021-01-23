import {
    BaseEntity, Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
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

    @ManyToOne(() => User, user => user.view)
    user: User

    @ManyToOne(() => ProductVariant, prv => prv.view)
    variant: ProductVariant

    @ManyToOne(() => Collection, coll => coll.views)
    collection: Collection

    @ManyToOne(() => Product, prod => prod.views)
    product: Product
}
