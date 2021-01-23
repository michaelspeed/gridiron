import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {FilterableField} from '@nestjs-query/query-graphql';
import {ID, ObjectType} from '@nestjs/graphql';

@ObjectType('Pin', {isAbstract: true})
@Entity({name: 'pin'})
export class Pin extends BaseEntity {
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
    deliveryPin: string;
}
