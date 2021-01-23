import { User } from "@gridiron/entities";
import {Field, ObjectType} from "@nestjs/graphql";

@ObjectType({isAbstract: true})
export class UserResponse {
    @Field(() => User)
    user: User

    @Field()
    token: string
}
