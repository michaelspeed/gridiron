import {
    BaseEntity,
    Column,
    CreateDateColumn, DeleteDateColumn,
    Entity,
    Index,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {User} from '..';
import {FilterableField, PagingStrategies, Relation} from '@nestjs-query/query-graphql';
import {Field, ID, ObjectType, registerEnumType} from '@nestjs/graphql';
import {AdministratorEnum} from '../../enums';

registerEnumType(AdministratorEnum, {
    name: 'AdministratorEnum'
})

@ObjectType('Administrator', {isAbstract: true})
@Relation('user', () => User, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true, relationName: 'user'})
@Entity({name: 'administrator'})
export class Administrator extends BaseEntity {

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
    firstName: string;

    @FilterableField()
    @Column({nullable: true})
    lastName: string | null;

    @FilterableField()
    @Column({ unique: true })
    emailAddress: string;

    @Field(() => AdministratorEnum)
    @Index()
    @Column({default: AdministratorEnum.SUPERADMIN, type:'enum', enum: AdministratorEnum})
    type: AdministratorEnum

    @Field(() => User)
    @Index()
    @OneToOne(type => User, us => us.administrator)
    @JoinColumn()
    user: User;
}
