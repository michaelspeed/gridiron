import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {ID, ObjectType} from '@nestjs/graphql';
import {FilterableField} from '@nestjs-query/query-graphql';

@ObjectType('Customer', {isAbstract: true})
@Entity({name: 'customer'})
export class Customer extends BaseEntity {
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
    deletedAt: Date | null;

    @FilterableField()
    @Column({ nullable: true })
    title: string;

    @FilterableField()
    @Column()
    firstName: string;

    @FilterableField()
    @Column()
    lastName: string;

    @FilterableField()
    @Column({ nullable: true })
    phoneNumber: string;

    @FilterableField()
    @Column({ unique: true })
    emailAddress: string;

}
