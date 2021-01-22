import {ValueTransformer} from 'typeorm';

export class DecimalTransformer implements ValueTransformer {
    to(value: any): any {
        return value;
    }

    from(value: any): any {
        return Number.parseFloat(value)
    }
}
