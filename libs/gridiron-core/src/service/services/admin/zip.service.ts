import { Zip, Vendor, Store } from '@gridiron/entities';
import {Injectable} from '@nestjs/common';
import {InjectConnection} from '@nestjs/typeorm';
import {Connection} from 'typeorm';

@Injectable()
export class ZipService {
    constructor(
        @InjectConnection() readonly connection: Connection
    ) {}

    findAll(): Promise<Zip[]> {
        return new Promise<Zip[]>((resolve, reject) => {
            this.connection.getRepository(Zip).find().then(value => {
                resolve(value)
            }).catch(error => reject(error))
        })
    }

    addZipToVendor(id: string, zips: string[]): Promise<Vendor> {
        return new Promise<Vendor>(async (resolve, reject) => {
            const store = await this.connection.getRepository(Store).findOne({where:{id}, relations: ['vendor']})
            const allZips = []
            for (const singz of zips) {
                const getzip = await this.connection.getRepository(Zip).findOne({where: {id: singz}})
                allZips.push(getzip)
            }
            store.zip = allZips
            this.connection.getRepository(Store).save(store).then(() => {
                resolve(store.vendor)
            }).catch(error => reject(error))
        })
    }
}
