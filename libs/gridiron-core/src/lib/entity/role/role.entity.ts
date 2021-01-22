import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {Field, ID, ObjectType, registerEnumType} from '@nestjs/graphql';
import {FilterableField} from '@nestjs-query/query-graphql';
import {Permission, RoleType} from '../../enums/RoleEnums';

registerEnumType(Permission, {
    name: 'Permission'
})

registerEnumType(RoleType, {
    name: 'RoleType'
})

@ObjectType('Role', {isAbstract: true})
@Entity({name: 'role'})
export class Role extends BaseEntity {
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
    code: string;

    @FilterableField()
    @Column()
    description: string;

    @Field(type => [Permission])
    @Column('simple-array')
    permissions: Permission[];

    @Field(type => RoleType)
    @Column({enum: RoleType, type: 'enum', default: RoleType.BASIC})
    type: RoleType

}
