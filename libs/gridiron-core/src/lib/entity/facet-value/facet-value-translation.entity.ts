import {Column, Entity} from 'typeorm';
import {ObjectType} from '@nestjs/graphql';
import {FilterableField} from '@nestjs-query/query-graphql';
import {GridIronEntity} from '../base/base.entity';

@ObjectType('FacetValueTranslation', {isAbstract: true})
@Entity({name: 'facetValueTranslation'})
export class FacetValueTranslation extends GridIronEntity {

    // @Column('varchar') languageCode: LanguageCode;

    @FilterableField()
    @Column()
    name: string;

}
