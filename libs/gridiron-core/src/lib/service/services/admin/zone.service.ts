import {Injectable} from '@nestjs/common';
import {Country, Zone} from '../../../entity';
import {InjectConnection} from '@nestjs/typeorm';
import {Connection} from 'typeorm';

@Injectable()
export class ZoneService {

    constructor(
        @InjectConnection() readonly connection: Connection
    ) {
    }

    async FindAll(): Promise<Zone[]> {
        return await this.connection.getRepository(Zone).find({relations: ['members', 'taxrates', 'stores']})
    }

    async FindOne(id: string): Promise<Zone> {
        return this.connection.getRepository(Zone).findOne({where:{id}, relations: ['members', 'stores', 'taxrates']})
    }

    async AddCountryToZone(id: string, countryId: string): Promise<Zone> {
        return new Promise(async (resolve, reject) => {
            console.log(id, countryId)
            const zone = await this.connection.getRepository(Zone).findOne({where:{id}})
            const country = await this.connection.getRepository(Country).findOne({where:{id: countryId}, relations: ['zone']})
            this.connection.createQueryBuilder().relation(Country, 'zone').of(country).add(zone)
                .then(value => {
                    resolve(zone)
                }).catch(error => reject(error))
        })
    }
}
