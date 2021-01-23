import { Country } from '@gridiron/entities';
import {Injectable} from '@nestjs/common';

@Injectable()
export class CountryService {
    async GetAllCountry(): Promise<Country[]> {
        return Country.find({order: {name: 'ASC'}})
    }
}
