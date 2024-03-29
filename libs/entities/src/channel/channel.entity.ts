import {BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {ID, ObjectType, registerEnumType} from '@nestjs/graphql';
import {FilterableField} from '@nestjs-query/query-graphql';
import { LanguageCode } from '../enums/LanguageCode';
import { CurrencyCode } from '../enums/CurrencyCode';
import { Zone } from '../zone/zone.entity';

registerEnumType(LanguageCode, {
    name: 'LanguageCode'
})
registerEnumType(CurrencyCode, {
    name: 'CurrencyCode'
})

@ObjectType('Channel', {isAbstract: true})
@Entity({name: 'channel'})
export class Channel extends BaseEntity {

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
    @Column({ unique: true })
    code: string;

    @FilterableField()
    @Column({ unique: true })
    token: string;

    @FilterableField(() => LanguageCode)
    @Column('varchar')
    defaultLanguageCode: LanguageCode;

    @ManyToOne(() => Zone)
    defaultTaxZone: Zone;

    @ManyToOne(() => Zone)
    defaultShippingZone: Zone;

    @FilterableField(() => CurrencyCode)
    @Column('varchar')
    currencyCode: CurrencyCode;

    @FilterableField()
    @Column()
    pricesIncludeTax: boolean;
}
