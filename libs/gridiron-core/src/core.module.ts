import {MiddlewareConsumer, Module, NestModule, OnApplicationBootstrap, OnApplicationShutdown} from '@nestjs/common';
import { CoreService } from './core.service';
import {EventBusModule} from './event-bus/event-bus.module';
import {ApiModule} from './api/api.module';
import {ServiceModule} from './service/service.module';
import {ConfigModule, ConfigService, Logger} from './config';
import {WorkerModule} from './worker/worker.module';
import {JobQueueModule} from './job-queue/job-queue.module';
import {HealthCheckModule} from './health-check/health-check.module';
import {PluginModule} from './plugin/plugin.module';
import {ProcessContextModule} from './process-context/process-context.module';
import {ModuleRef} from '@nestjs/core';
import {RequestHandler} from 'express';
import { InjectableStrategy, Injector } from '@gridiron/gridiron-common';

@Module({
  imports:[
      ConfigModule,
      EventBusModule,
      ServiceModule.forRoot(),
      WorkerModule,
      JobQueueModule,
      HealthCheckModule,
      ProcessContextModule.forRoot(),
      ApiModule,
      PluginModule.forRoot(),
  ],
  providers: [CoreService],
  exports: [CoreService],
})
export class CoreModule implements NestModule, OnApplicationBootstrap, OnApplicationShutdown {
    constructor(
        private configService: ConfigService,
        private moduleRef: ModuleRef
    ) {}

    configure(consumer: MiddlewareConsumer): any {
        const {adminApiPath, shopApiPath, middleware} = this.configService.apiOptions
        const defaultMiddleware: Array<{handler: RequestHandler, route?: string}> = []
        const allMiddleWare = defaultMiddleware.concat(middleware)
        const middlewareRoute = this.groupMiddlewareByRoute(allMiddleWare)
        for (const [route, handlers] of Object.entries(middlewareRoute)) {
            consumer.apply(...handlers).forRoutes(route)
        }
    }

    private groupMiddlewareByRoute(
        middlewareArray: Array<{handler: RequestHandler; route?: string}>
    ): { [route: string]: RequestHandler[] } {
        const result = {} as { [route: string]: RequestHandler[] };
        for (const middleware of middlewareArray) {
            const route = middleware.route || this.configService.apiOptions.adminApiPath;
            if (!result[route]) {
                result[route] = [];
            }
            result[route].push(middleware.handler);
        }
        return result;
    }

    async onApplicationBootstrap() {
        await this.initInjectableStrategies()
    }

    async onApplicationShutdown(signal?: string) {
        await this.destroyInjectableStrategies()
        if (signal) {
            Logger.info('Received shutdown signal:' + signal);
        }
    }

    private async initInjectableStrategies() {
        const injector = new Injector(this.moduleRef);
        for (const strategy of this.getInjectableStrategies()) {
            if (typeof strategy.init === 'function') {
                await strategy.init(injector);
            }
        }
    }

    private async destroyInjectableStrategies() {
        for (const strategy of this.getInjectableStrategies()) {
            if (typeof strategy.destroy === 'function') {
                await strategy.destroy();
            }
        }
    }

    private getInjectableStrategies(): InjectableStrategy[] | any {
        const { jobQueueStrategy } = this.configService.jobQueueOptions;
        return [
            jobQueueStrategy,
        ];
    }
}
