import {GridIronEvents} from '../gridIron-events';
import {Asset} from '../../entity';

export class AssetEvent extends GridIronEvents {
    constructor(
        public asset: Asset,
        public type: 'created' | 'updated' | 'deleted',
    ) {
        super();
    }
}
