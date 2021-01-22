import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType({isAbstract: true})
export class PagingTypes {
    @Field({nullable: true})
    take?: number | null

    @Field({nullable: true})
    skip?: number | null

    @Field({nullable: true})
    count?: number | null
}
