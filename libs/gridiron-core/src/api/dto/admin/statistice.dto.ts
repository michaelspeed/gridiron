import {Field, ObjectType} from "@nestjs/graphql";

@ObjectType({isAbstract: true})
export class DataSource {
    @Field()
    sum: number

    @Field()
    amount: number
}

@ObjectType({isAbstract: true})
export class ProdDataSource {
    @Field()
    sum: number
}

@ObjectType({isAbstract: true})
export class StatisticeDto {
    @Field(() => [String])
    labels: string[]
    @Field(() => [DataSource])
    datasource: DataSource[]
}


@ObjectType({isAbstract: true})
export class StatisticeProdDto {
    @Field(() => [String])
    labels: string[]
    @Field(() => [ProdDataSource])
    datasource: ProdDataSource[]
}
