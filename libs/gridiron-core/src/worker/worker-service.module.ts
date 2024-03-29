import {Module} from '@nestjs/common';
import {ClientProxyFactory} from '@nestjs/microservices';
import {ConfigModule, ConfigService} from '../config';
import {GRIDIRON_WORKER_CLIENT} from './constants';
import {WorkerService} from './worker.service';

@Module({
    imports: [ConfigModule],
    providers: [
        WorkerService,
        {
            provide: GRIDIRON_WORKER_CLIENT,
            useFactory: (configService: ConfigService) => {
                return ClientProxyFactory.create({
                    transport: configService.workerOptions.transport as any,
                    options: configService.workerOptions.options as any
                })
            },
            inject: [ConfigService]
        }
    ],
    exports: [WorkerService]
})
export class WorkerServiceModule {}
