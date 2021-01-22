import {Inject, Injectable, OnModuleInit} from '@nestjs/common';
import {Collection, CollectionQuery, Product, Vendor} from '../../../entity';
import {Connection, getConnection, Repository} from 'typeorm';
import {InjectConnection, InjectRepository} from '@nestjs/typeorm';
import {EventBus, ProductEvents} from '../../../event-bus';
import {merge} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

@Injectable()
export class CollectionService implements OnModuleInit {

    constructor(
        @InjectConnection() private connection: Connection,
        private eventBus: EventBus
    ) {
    }

    onModuleInit() {
        const productEvents$ = this.eventBus.ofType(ProductEvents)
        merge(productEvents$)
            .pipe(debounceTime(50))
            .subscribe(async (event) => {
                await this.setDefaultCollectionToProduct(event.product)
            })
    }

    async setDefaultCollectionToProduct(product: Product): Promise<Product> {
        return new Promise(async (resolve, reject) => {
            const defaultCol = await this.connection.getRepository(Collection).findOne({where:{name: 'default'}})
            if (defaultCol) {
                product.collection = defaultCol
                await this.connection.getRepository(Product).save(product)
            } else {
                const def = new Collection()
                def.name = 'default'
                def.isRoot = true
                def.inMenu = false
                def.description = 'Default Collection'
                product.collection = await this.connection.getRepository(Collection).save(def)
                await this.connection.getRepository(Product).save(product)
            }
        })
    }

    async AddParentToChildCollection(parentId: string, childId: string): Promise<Collection> {
        return new Promise(async (resolve, reject) => {
            const col = await Collection.findOne({where:{id: childId}})
            const parent = await Collection.findOne({where:{id: parentId}})
            col.parent = parent
            col.save().then(value => {
                resolve(value)
            })
        })
    }


    async GetCollectionTree(): Promise<Collection[]> {
        return getConnection().getTreeRepository(Collection).findTrees()
    }
}
