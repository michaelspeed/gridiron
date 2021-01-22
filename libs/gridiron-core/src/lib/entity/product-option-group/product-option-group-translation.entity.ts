import {Column, Entity} from 'typeorm';
import {GridIronEntity} from '../base/base.entity';
import {ObjectType} from '@nestjs/graphql';
import {FilterableField} from '@nestjs-query/query-graphql';

@ObjectType('ProductOptionGroupTranslation', {isAbstract: true})
@Entity({name: 'productOptionGroupTranslation'})
export class ProductOptionGroupTranslation extends GridIronEntity {

    //@Column('varchar') languageCode: LanguageCode;

    @FilterableField()
    @Column()
    name: string;
}
