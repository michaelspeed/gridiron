import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {ID, ObjectType} from '@nestjs/graphql';
import {FilterableField} from '@nestjs-query/query-graphql';

@ObjectType('Promotion', {isAbstract: true})
@Entity({name: 'promotion'})
export class Promotion extends BaseEntity {
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
    @Column({ type: Date, nullable: true })
    startsAt: Date | null;

    @FilterableField()
    @Column({ type: Date, nullable: true })
    endsAt: Date | null;

    @FilterableField()
    @Column({ nullable: true })
    couponCode: string;

    @FilterableField()
    @Column({ nullable: true })
    perCustomerUsageLimit: number;

    @FilterableField()
    @Column()
    name: string;

    @FilterableField()
    @Column()
    enabled: boolean;

    @FilterableField()
    @Column()
    priorityScore: number;

}
