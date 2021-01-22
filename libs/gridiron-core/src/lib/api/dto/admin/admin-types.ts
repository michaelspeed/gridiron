import {FileUpload} from 'graphql-upload';
import {Field, Float, InputType, Int, ObjectType, registerEnumType} from '@nestjs/graphql';
import {DateOperators, ID, NumberOperators, StringOperators} from '../../../common';

export declare type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    DateTime: any;
    JSON: any;
    Upload: any;
};
export declare type Maybe<T> = T | null;

export enum SortOrder {
    ASC = "ASC",
    DESC = "DESC"
}

registerEnumType(SortOrder, {
    name: 'SortOrder'
})

@ObjectType({isAbstract: true})
export class CoordinateInput {
    @Field(() => Float)
    x: number;

    @Field(() => Float)
    y: number;
}

@ObjectType({isAbstract: true})
export class UpdateAssetInput {
    @Field()
    id: string

    @Field({nullable: true})
    name?: string

    @Field(() => CoordinateInput, {nullable: true})
    focalPoint?: CoordinateInput
}

@ObjectType({isAbstract: true})
export class MutationUpdateAssetArgs {

    @Field(() => UpdateAssetInput)
    input: UpdateAssetInput;
}

export declare type CreateAssetInput = {
    file: FileUpload;
};

@ObjectType({isAbstract: true})
export class AssetSortParameter {
    @Field(() => SortOrder)
    id?: SortOrder

    @Field(() => SortOrder)
    createdAt?: SortOrder

    @Field(() => SortOrder)
    updatedAt?: SortOrder

    @Field(() => SortOrder)
    name?: SortOrder

    @Field(() => SortOrder)
    fileSize?: SortOrder

    @Field(() => SortOrder)
    mimeType?: SortOrder

    @Field(() => SortOrder)
    width?: SortOrder

    @Field(() => SortOrder)
    height?: SortOrder

    @Field(() => SortOrder)
    source?: SortOrder

    @Field(() => SortOrder)
    preview?: SortOrder
};

@ObjectType({isAbstract: true})
export class AssetFilterParameter {
    createdAt?: DateOperators
    updatedAt?: DateOperators
    name?: StringOperators
    type?: StringOperators
    fileSize?: NumberOperators
    mimeType?: StringOperators
    width?: NumberOperators
    height?: NumberOperators
    source?: StringOperators
    preview?: StringOperators
};

@ObjectType({isAbstract: true})
export class AssetListOptions {
    @Field(() => Int)
    skip?: number

    @Field(() => Int)
    take?: number

    sort?: Maybe<AssetSortParameter>;
    filter?: Maybe<AssetFilterParameter>;
};

@ObjectType({isAbstract: true})
export class QueryAssetsArgs  {
    options?: any
};
