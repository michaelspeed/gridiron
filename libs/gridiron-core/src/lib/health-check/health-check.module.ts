import {Module} from '@nestjs/common';
import {HealthCheckController} from './health-check.controller';
import {MicroserviceHealthIndicator, TerminusModule, TypeOrmHealthIndicator} from '@nestjs/terminus';
import {HealthCheckRegistryService} from './health-check-registry.service';
import {ConfigModule, ConfigService} from '../config';

@Module({
  imports: [
      TerminusModule, ConfigModule
  ],
  controllers: [HealthCheckController],
  providers: [HealthCheckRegistryService],
  exports: [HealthCheckRegistryService]
})
export class HealthCheckModule {
  constructor(
     private configService: ConfigService,
     private healthCheckRegistryService: HealthCheckRegistryService,
     private typeOrm: TypeOrmHealthIndicator,
     private microservice: MicroserviceHealthIndicator
  ) {
    this.healthCheckRegistryService.registerIndicatorFunction([
      () => this.typeOrm.pingCheck('database'),
      () =>
          this.microservice.pingCheck('worker', {
            transport: this.configService.workerOptions.transport,
            options: this.configService.workerOptions.options
          })
    ])
  }
}
