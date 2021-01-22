import {Column, Entity} from 'typeorm';
import {GridIronEntity} from '../base/base.entity';
import {ObjectType} from '@nestjs/graphql';
import {FilterableField} from '@nestjs-query/query-graphql';
import {LanguageCode} from '../../enums/LanguageCode';

@ObjectType('ProductOptionTranslation', {isAbstract: true})
@Entity({name: 'productOptionTranslation'})
export class ProductOptionTranslation extends GridIronEntity {


    @FilterableField()
    @Column()
    name: string;

    @Column('varchar')
    languageCode: LanguageCode;
}
