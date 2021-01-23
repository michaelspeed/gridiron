import { Product } from '@gridiron/entities';
import {GridIronEvents} from '../';

export class ProductEvents extends GridIronEvents {
    constructor(
        public product: Product,
        public type: 'created' | 'updated' | 'deleted',
    ) {
        super();
    }
}
