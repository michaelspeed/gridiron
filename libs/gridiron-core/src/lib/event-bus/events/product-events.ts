import {GridIronEvents} from '../';
import {Product} from '../../entity';

export class ProductEvents extends GridIronEvents {
    constructor(
        public product: Product,
        public type: 'created' | 'updated' | 'deleted',
    ) {
        super();
    }
}
