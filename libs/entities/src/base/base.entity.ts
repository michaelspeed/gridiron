import {DeepPartial} from '../../common';

export abstract class GridIronEntity {
    protected constructor(input?: DeepPartial<GridIronEntity>) {
        if (input) {
            for (const [key, value] of Object.entries(input)) {
                (this as any)[key] = value
            }
        }
    }
}
