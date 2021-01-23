import {BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {ID, ObjectType} from '@nestjs/graphql';
import {Connection, FilterableField, PagingStrategies, Relation} from '@nestjs-query/query-graphql';
import {DecimalTransformer} from '../utils/ValueTransformers';
import { TaxCategory } from '../tax-category/tax-category.entity';
import { Zone } from '../zone/zone.entity';
import { ProductVariantPrice } from '../product-variant/product-variant-price.entity';

@ObjectType('TaxRate', {isAbstract: true})
@Relation('category', () => TaxCategory, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Relation('zone', () => Zone, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Connection('variants', () => ProductVariantPrice, {pagingStrategy: PagingStrategies.OFFSET, enableAggregate: true})
@Entity({name: 'taxRate'})
export class TaxRate extends BaseEntity {
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
    @Column()
    name: string;

    @FilterableField()
    @Column({ type: 'decimal', precision: 5, scale: 2, transformer: new DecimalTransformer() })
    value: number;

    @FilterableField()
    @Column()
    enabled: boolean;

    @ManyToOne(() => TaxCategory, cat => cat.rate)
    category: TaxCategory

    @ManyToOne(() => Zone, zone => zone.taxrates)
    zone: Zone

    @OneToMany(() => ProductVariantPrice, prv => prv.tax)
    variants: ProductVariantPrice[]

    taxComponentOf(grossPrice: number): number {
        return Math.round(grossPrice - grossPrice / ((100 + this.value) / 100))
    }

    netPriceOf(grossPrice: number): number {
        return grossPrice - this.taxComponentOf(grossPrice);
    }

    taxPayableOn(netPrice: number): number {
        return Math.round(netPrice * (this.value / 100));
    }

    grossPriceOf(netPrice: number): number {
        return netPrice + this.taxPayableOn(netPrice);
    }
}
