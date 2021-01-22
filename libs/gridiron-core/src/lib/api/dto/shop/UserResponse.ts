import {Field, ObjectType} from "@nestjs/graphql";
import {User} from "../../../entity";

@ObjectType({isAbstract: true})
export class UserResponse {
    @Field(() => User)
    user: User

    @Field()
    token: string
}
