import {Injectable} from '@nestjs/common';
import {Asset, Collection, FacetValue, Product, ProductAsset} from '../../../entity';
import {InjectConnection} from '@nestjs/typeorm';
import {Connection, EntitySubscriberInterface, EventSubscriber, UpdateEvent} from 'typeorm';
import {EventBus, ProductEvents} from '../../../event-bus';

@Injectable()
@EventSubscriber()
export class ProductService implements EntitySubscriberInterface<Product>{
    constructor(
        @InjectConnection() private connection: Connection,
        private eventBus: EventBus
    ) {
        connection.subscribers.push(this)
    }

    listenTo(): Function | string {
        return Product
    }

    createProduct(name: string, desc: string, slug: string, assets:string[], facets: string[], featured: string): Promise<Product> {
        return new Promise<Product>(async (resolve, reject) => {
            const prod = new Product()
            prod.productName = name
            prod.description = desc
            prod.slug = slug
            prod.viewcode = []
            prod.featuredAsset = await this.connection.getRepository(Asset).findOne({where: {id: featured}})
            let prodFacet: FacetValue[] = []
            for (const facetId of facets) {
                const face = await FacetValue.findOne({where: {id: facetId}})
                prodFacet.push(face)
            }
            prod.facets = prodFacet
            this.connection.getRepository(Product).save(prod).then(async (value) => {
                let allProdAssets: ProductAsset[] = []
                for (const assetId of assets) {
                    const asset = await this.connection.getRepository(Asset).findOne({where: {id: assetId}})
                    const prodAsset = new ProductAsset()
                    prodAsset.asset = asset
                    prodAsset.product = value
                    const passet = await prodAsset.save()
                    allProdAssets.push(passet)
                }
                this.eventBus.publish(new ProductEvents(value, 'created'))
                resolve(prod)
            })
        })
    }

    updateProductCollection(id: string, collectionId: string): Promise<Product> {
        return new Promise<Product>(async (resolve, reject) => {
            const prod = await this.connection.getRepository(Product).findOne({where:{id}})
            prod.collection = await this.connection.getRepository(Collection).findOne({where: {id: collectionId}})
            this.connection.getRepository(Product).save(prod)
                .then(value => resolve(value)).catch(error => reject(error))
        })
    }

    updateProduct(id: string, name: string, desc: string, assets:string[], facets: string[], featured: string, viewcode: string[]): Promise<Product> {
        return new Promise<Product>(async (resolve, reject) => {
            const prod = await Product.findOne({where: {id}})
            prod.productName = name
            prod.description = desc
            let prodFacet: FacetValue[] = []
            prod.featuredAsset = await this.connection.getRepository(Asset).findOne({where: {id: featured}})
            for (const facetId of facets) {
                const face = await FacetValue.findOne({where: {id: facetId}})
                await prodFacet.push(face)
            }
            prod.assets = []
            prod.facets = prodFacet
            prod.viewcode = viewcode
            this.connection.getRepository(Product).save(prod).then(async (value) => {
                for (const assetId of assets) {
                    const ass = await this.connection.getRepository(Asset).findOne({where:{id: assetId}})
                    if (ass) {
                        const prodAss = new ProductAsset()
                        prodAss.asset = ass
                        prodAss.product = value
                        await this.connection.getRepository(ProductAsset).save(prodAss)
                    }
                }
                resolve(value)
            }).catch(error => {
                reject(error)
            })
        })
    }
}
