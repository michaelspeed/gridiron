import {DynamicModule, Injectable} from '@nestjs/common';
import {ConnectionOptions} from 'typeorm';
import {ApiOptions, AssetOptions, AuthOptions, GridIronConfig, JobQueueOptions, RuntimeGridIronConfig, WorkerOptions} from './GridIronConfig';
import {GridIronLogger} from './logger/GridIronLogger';
import {getConfig} from './config-helpers';
import {Type} from '../common';

@Injectable()
export class ConfigService implements GridIronConfig {
    private activeConfig: RuntimeGridIronConfig

    constructor() {
        this.activeConfig = getConfig()
    }
    
    get authOptions(): Required<AuthOptions> {
        return this.activeConfig.authOptions
    }

    get apiOptions(): Required<ApiOptions> {
        return this.activeConfig.apiOptions;
    }

    get dbConnectionOptions(): ConnectionOptions {
        return this.activeConfig.dbConnectionOptions
    }

    get logger(): GridIronLogger {
        return this.activeConfig.logger;
    }

    get workerOptions(): WorkerOptions {
        return this.activeConfig.workerOptions
    }

    get plugins(): Array<DynamicModule | Type<any>> {
        return this.activeConfig.plugins;
    }

    get assetOptions(): AssetOptions {
        return this.activeConfig.assetOptions;
    }

    get jobQueueOptions(): Required<JobQueueOptions> {
        return this.activeConfig.jobQueueOptions;
    }

    get defaultTax(): number {
        return this.activeConfig.defaultTax
    }

    get flatFeeAmount(): number {
        return this.activeConfig.flatFeeAmount
    }

}
