import {Injectable} from '@nestjs/common';
import {InjectConnection} from '@nestjs/typeorm';
import {Connection} from 'typeorm';
import {ProductVariant, Seo} from '../../../entity';

@Injectable()
export class SeoService {
    constructor(
        @InjectConnection() private connection: Connection
    ) {}

    createProductSeo(variantId: string, urlKey: string, metatitle: string, metakeywords: string[], metadesc: string): Promise<Seo> {
        return new Promise<Seo>(async (resolve, reject) => {
            const newseo = new Seo()
            newseo.urlKey = urlKey
            newseo.metatitle = metatitle
            newseo.metakeywords = metakeywords
            newseo.metadesc = metadesc

            const getvaraint = await this.connection.getRepository(ProductVariant).findOne({where:{id: variantId}})

            newseo.variant = getvaraint
            this.connection.getRepository(Seo).save(newseo)
                .then(value => resolve(value))
                .catch(error => reject(error))
        })
    }

    updateProductSeo(seoId: string, urlKey: string, metatitle: string, metakeywords: string[], metadesc: string): Promise<Seo> {
        return new Promise<Seo>(async (resolve, reject) => {
            const newseo = await this.connection.getRepository(Seo).findOne({where:{id: seoId}})
            newseo.urlKey = urlKey
            newseo.metatitle = metatitle
            newseo.metakeywords = metakeywords
            newseo.metadesc = metadesc
            this.connection.getRepository(Seo).save(newseo)
                .then(value => resolve(value))
                .catch(error => reject(error))
        })
    }
}
