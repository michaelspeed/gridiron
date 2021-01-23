import {Module, OnApplicationShutdown, OnModuleDestroy, OnModuleInit} from '@nestjs/common';
import {APP_INTERCEPTOR} from '@nestjs/core';
import {MessageInterceptors} from './message-interceptors';
import {ConfigModule, Logger} from '../config';
import {WorkerMonitor} from './worker-monitor';
import {WorkerServiceModule} from './worker-service.module';
import {ProcessContextModule} from '../process-context';
import {PluginModule} from '../plugin/plugin.module';
import {ServiceModule} from '../service/service.module';

@Module({
  imports: [
      WorkerServiceModule,
      ConfigModule,
      ServiceModule.forWorker(),
      PluginModule.forWorker(),
      ProcessContextModule.forWorker()
  ],
  providers: [
      WorkerMonitor,
    {
      provide: APP_INTERCEPTOR,
      useClass: MessageInterceptors
    }
  ]
})
export class WorkerModule implements OnModuleDestroy, OnApplicationShutdown{
  constructor(private monitor: WorkerMonitor) {}

  onApplicationShutdown(signal?: string): any {
    if (signal) {
      Logger.info('Worker Received shutdown signale:' + signal)
    }
  }

    onModuleDestroy(): any {
        return this.monitor.waitForOpenTaskToComplete()
    }
}
