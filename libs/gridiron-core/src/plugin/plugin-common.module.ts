import {Module} from '@nestjs/common';
import {ConfigModule} from '../config';
import {EventBusModule} from '../event-bus';
import {WorkerServiceModule} from '../worker/worker-service.module';
import {ServiceModule} from '../service/service.module';
import {HealthCheckModule} from '../health-check/health-check.module';
import {JobQueueModule} from '../job-queue/job-queue.module';

@Module({
    imports: [
        EventBusModule,
        WorkerServiceModule,
        ConfigModule,
        ServiceModule.forPlugin(),
        HealthCheckModule,
        JobQueueModule
    ],
    exports: [
        EventBusModule,
        WorkerServiceModule,
        ConfigModule,
        ServiceModule.forPlugin(),
        HealthCheckModule,
        JobQueueModule
    ]
})
export class PluginCommonModule {}
