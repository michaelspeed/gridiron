import { User, Vendor } from '@gridiron/entities';
import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType({isAbstract: true})
export class VendorDto {
    @Field(() => User)
    user: User

    @Field()
    token: string

    @Field(() => Vendor)
    vendor: Vendor
}
