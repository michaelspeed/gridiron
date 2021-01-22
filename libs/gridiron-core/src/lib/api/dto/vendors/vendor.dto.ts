import {Field, ObjectType} from '@nestjs/graphql';
import {User, Vendor} from '../../../entity';

@ObjectType({isAbstract: true})
export class VendorDto {
    @Field(() => User)
    user: User

    @Field()
    token: string

    @Field(() => Vendor)
    vendor: Vendor
}
