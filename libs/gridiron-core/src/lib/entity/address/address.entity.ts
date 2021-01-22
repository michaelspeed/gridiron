import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {Country} from '../country/country.entity';
import {Field, ID, ObjectType, registerEnumType} from '@nestjs/graphql';
import {Connection, FilterableField, Relation} from '@nestjs-query/query-graphql';
import {AddressType} from "../../enums/AddressType";
import {User} from "@gridiron/core/entity";

registerEnumType(AddressType, {
    name: 'AddressType'
})

@ObjectType('Address', {isAbstract: true})
@Entity({name: 'address'})
@Relation('user', () => User, {nullable: true, relationName: 'user'})
export class Address extends BaseEntity {

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
    @Column({ default: '' })
    fullName: string;

    @FilterableField()
    @Column({type: "text"})
    addressLine: string;

    @FilterableField()
    @Column({ default: '' })
    city: string;

    @FilterableField()
    @Column({ default: '' })
    state: string;

    @FilterableField()
    @Column({ default: '' })
    landmark: string;

    @FilterableField()
    @Column({ default: '' })
    postalCode: string;

    @ManyToOne(type => Country)
    country: Country;

    @FilterableField()
    @Column({ default: '' })
    phoneNumber: string;

    @FilterableField()
    @Column({ default: '' })
    alternatePhoneNumber: string;

    @FilterableField()
    @Column({ default: false })
    defaultShippingAddress: boolean;

    @FilterableField()
    @Column({ default: false })
    defaultBillingAddress: boolean;

    @FilterableField(() => AddressType)
    @Column({type: "enum", enum: AddressType, default: AddressType.HOME})
    addressType: AddressType

    // @Field(() => User)
    @ManyToOne(() => User, use => use.address)
    user: User

}
