import {Column, Entity} from 'typeorm';
import {ObjectType} from '@nestjs/graphql';
import {FilterableField} from '@nestjs-query/query-graphql';
import {GridIronEntity} from '../base/base.entity';

@ObjectType('ProductVariantTranslation', {isAbstract: true})
@Entity({name: 'productVariantTranslation'})
export class ProductVariantTranslation extends GridIronEntity {

    // @Column('varchar') languageCode: LanguageCode;

    @FilterableField()
    @Column()
    name: string;

}
