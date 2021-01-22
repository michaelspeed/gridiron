import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType({isAbstract: true})
export class MenuResponseTypes {

    @Field()
    menu: string

}
