import {Injectable} from '@nestjs/common';
import {InjectConnection} from '@nestjs/typeorm';
import {Connection} from 'typeorm';
import {TaxCategory, TaxRate} from '../../../entity';

@Injectable()
export class TaxCategoryService {

    constructor(
        @InjectConnection() private connection: Connection
    ) {}

    async getAllTaxRates(): Promise<TaxRate[]> {
        return this.connection.getRepository(TaxRate).find()
    }

    async getAllTaxRule(): Promise<TaxCategory[]> {
        return this.connection.getRepository(TaxCategory).find()
    }
}
