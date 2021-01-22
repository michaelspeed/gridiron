import {
    BaseEntity,
    Column,
    CreateDateColumn, DeleteDateColumn,
    Entity, JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {ID, ObjectType, registerEnumType} from "@nestjs/graphql";
import {FilterableField, FilterableRelation, PagingStrategies, Relation} from "@nestjs-query/query-graphql";
import {ProductVariantPrice} from "../../entity";
import {PricePromoType} from "@gridiron/core/enums";

registerEnumType(PricePromoType, {
    name: 'PricePromoType'
})

@ObjectType('PromotionVariantPrice', {isAbstract: true})
@Entity('promotion-variant-price')
@FilterableRelation('price', () => ProductVariantPrice, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
export class PromotionVariantPrice extends BaseEntity {

    @FilterableField(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @FilterableField()
    @CreateDateColumn()
    createdAt: Date;

    @FilterableField()
    @UpdateDateColumn()
    updatedAt: Date;

    @FilterableField()
    @DeleteDateColumn()
    deletedAt?: Date;

    @FilterableField(() => PricePromoType)
    @Column({type: "enum", enum: PricePromoType, default: PricePromoType.PERCENTAGE})
    priceType: PricePromoType

    @FilterableField()
    @Column()
    value: number

    @FilterableField()
    @Column({default: false})
    forever: boolean

    @FilterableField()
    @Column({ type: Date, nullable: true })
    startsAt: Date | null;

    @FilterableField()
    @Column({ type: Date, nullable: true })
    endsAt: Date | null;

    @FilterableField()
    @Column({default: true})
    enabled: boolean

    @OneToOne(() => ProductVariantPrice, varprice => varprice.promoprice)
    @JoinColumn()
    price: ProductVariantPrice

}
