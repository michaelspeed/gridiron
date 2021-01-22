import {Injectable} from '@nestjs/common';
import {HealthIndicatorFunction} from '@nestjs/terminus';

@Injectable()
export class HealthCheckRegistryService {
    get healthIndicatorFunctions(): HealthIndicatorFunction[] {
        return this.healthIndicatorFunctions
    }

    private _healthIndicatorFunctions: HealthIndicatorFunction[] = []

    registerIndicatorFunction(fn: HealthIndicatorFunction | HealthIndicatorFunction[]) {
        const fnArray = Array.isArray(fn) ? fn : [fn]
        this._healthIndicatorFunctions.push(...fnArray)
    }
}
