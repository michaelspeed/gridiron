import { Collection, FacetValue } from "@gridiron/entities";
import {Field, ObjectType} from "@nestjs/graphql";

@ObjectType({isAbstract: true})
export class CollectionSingleResponse {
    @Field(() => Collection)
    collection: Collection

    @Field(() => [FacetValue])
    facetValues: FacetValue[]
}
