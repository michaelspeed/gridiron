import { Asset } from '@gridiron/entities';
import {GridIronEvents} from '../gridIron-events';

export class AssetEvent extends GridIronEvents {
    constructor(
        public asset: Asset,
        public type: 'created' | 'updated' | 'deleted',
    ) {
        super();
    }
}
