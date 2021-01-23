import {Injectable} from '@nestjs/common';
import {Country} from '../../../entity';

@Injectable()
export class CountryService {
    async GetAllCountry(): Promise<Country[]> {
        return Country.find({order: {name: 'ASC'}})
    }
}
