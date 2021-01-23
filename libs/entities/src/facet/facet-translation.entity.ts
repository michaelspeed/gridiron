import {Column, Entity} from 'typeorm';
import {ObjectType} from '@nestjs/graphql';
import {FilterableField} from '@nestjs-query/query-graphql';
import {GridIronEntity} from '../base/base.entity';

@ObjectType('FacetTranslation', {isAbstract: true})
@Entity({name: 'facettranslation'})
export class FacetTranslation extends GridIronEntity {

    // @Column('varchar') languageCode: LanguageCode;

    @FilterableField()
    @Column()
    name: string;

}
